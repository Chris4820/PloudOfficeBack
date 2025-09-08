import { Request, Response, type NextFunction } from "express";
import { getUserByEmail, updatePassword } from "./auth.service";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { generateAuthJWT } from "../../commons/jwt/auth.jwt";
import type { LoginSchemaProps } from "./schema/login.schema";
import type { RegisterSchemaProps } from "./schema/register.schema";
import { createUser, isEmailExist } from "../user/user.service";
import { ConflictException } from "../../commons/errors/custom.error";
import type { CreateUserProps } from "../user/types/user.type";
import { generateShortName } from "../../utils/utils";
import type { forgotPasswordFormData } from "./schema/forgotPassword.schema";
import redis from "../../libs/redis";
import { generateToken } from "../../utils/crypto";
import { sendRecoveryPassword } from "../../commons/email/email.service";
import type { resetPasswordSchemaFormData } from "./schema/resetPassword.schema";




export async function LoginController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as LoginSchemaProps;

    console.log(data);
    const user = await getUserByEmail(data.email);
    if (!user || !(await comparePassword(data.password, user.password))) {
      return res.status(400).json({ message: 'Credenciais inválidas' })
    }

    //Validado
    const token = await generateAuthJWT(user.id, data.remember ? '7d' : '2h');
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({
      user: userWithoutPassword,
      session: {
        token,
      }
    })
  } catch (error) {
    next(error);
  }
}

export async function RegisterController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as RegisterSchemaProps;
    //Verificar se o email já está registrado
    const user = await isEmailExist(data.email);
    if (user) {
      throw new ConflictException("Esse email já está registado");
    }
    const currentUserData: CreateUserProps = {
      name: data.name,
      email: data.email,
      password: await hashPassword(data.password),
      shortName: await generateShortName(data.name),
    }

    await createUser(currentUserData)
    return res.status(200).json({ message: 'Registado com sucesso!' });
  } catch (error) {
    next(error);
  }
}

export async function ForgotPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as forgotPasswordFormData;
    const user = await getUserByEmail(data.email);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    const userToken = await redis.get(`forgot_password_${user.id}`);
    if (userToken) {
      //Já foi enviado um email anteirormente para este email
      return res.status(400).json({ message: 'Um email de redefinição de senha já foi enviado para este email' });
    } else {
      //Envia o email
      const token = await generateToken(6);
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://app.ploudstore.com/auth/reset-password"
          : "http://localhost:5173/auth/reset-password";
      const verificationLink = `${baseUrl}/${token}`;

      await Promise.all([
        redis.set(`forgot_password_${user.id}`, token, "EX", 300),
        redis.set(`forgot_password_token_${token}`, user.id, "EX", 300),
        sendRecoveryPassword({
          email: user.email,
          verificationLink: verificationLink,
          userName: user.name,
        })
      ]);

      return res.status(200).json({ message: 'Ok' });


    }
  } catch (error) {
    next(error);
  }
}

export async function ResetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as resetPasswordSchemaFormData;
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: 'Token não fornecido' });
    }
    const userId = await redis.get(`forgot_password_token_${token}`);
    if (!userId) {
      return res.status(400).json({ message: 'Token inválido' });
    }
    const passwordHashed = await hashPassword(data.password);

    await updatePassword(Number(userId), passwordHashed);

    return res.status(200).json({ message: 'Senha redefinida com sucesso' });

  } catch (error) {
    next(error);
  }
}