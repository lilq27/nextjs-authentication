import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import db from './db';
import { cookies } from 'next/headers';

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
});

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false, // 세션 쿠키가 자동으로 만료되지 않음
        attributes: {
            secure: process.env.NODE_ENV === 'production' //https에서만 실행하도록 
        }
    }
});

//로그인 처리 (세션 생성 & 쿠키 저장)
export async function createAuthSession(userId) {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );
}

//사용자가 로그인되어 있는지 확인 (세션 검증)
export async function verifyAuth() {
    const sessionCookie = cookies().get(lucia.sessionCookieName);

    //쿠키가 없으면 로그아웃 상태로 처리
    if(!sessionCookie) {
        return {
            user: null,
            session: null
        };
    }

    const sessionId = sessionCookie.value;

    //쿠키 값이 비어 있으면 로그아웃 상태.
    if(!sessionId) {
        return {
            user: null,
            session: null
        };
    }

    const result = lucia.validateSession(sessionId);

    try {
        //세션이 새로 생성된 경우, 새로운 세션 쿠키를 설정
        if(result.session && result.session.fresh) {
            const sessionCookie = lucia.createBlankSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name, 
                sessionCookie.value, 
                sessionCookie.attributes
            );
        }

        //세션이 만료된 경우 (자동 로그아웃 처리)
        if(!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name, 
                sessionCookie.value, 
                sessionCookie.attributes
            );
        }
    } catch {}

    return result;
}