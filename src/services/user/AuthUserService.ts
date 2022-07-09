import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';

interface AuthRequest {
    email: string,
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error("Email ou Usuário incorreto(s) ou não cadastrado(s)!");
        }

        //verificar se a senha está correta
        const passwordMath = await compare(password, user.password);

        if (!passwordMath) {
            throw new Error("Email ou Usuário incorreto(s) ou não cadastrado(s)!");
        }

        //gerar token do usuário
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        }
    }
}

export { AuthUserService };