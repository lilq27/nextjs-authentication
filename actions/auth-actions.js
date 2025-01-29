'use server';

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    let errors = {};

    if(!email.includes('@')) {
        errors.email = 'Please enter a valid email address.'
    }

    if(password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters long.'
    }

    if(Object.keys(errors).length > 0) {
        return {
            // errors: errors
            errors,
        };
    }

    const hashedPassword = hashUserPassword(password);

    try {
        const userId = createUser(email, hashedPassword);
        await createAuthSession(userId);
        redirect('/training');
    } catch (error) {
        if(error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                errors: {
                    email: '이미 존재하는 이메일 입니다.'
                }
            };
        }
        throw error; //error.js로 처리됨
    }
    //npm install lucia @lucia-auth/adapter-sqlite
    //lucia 세션 생성하고 저장할 위치 => adapter-sqlite
}