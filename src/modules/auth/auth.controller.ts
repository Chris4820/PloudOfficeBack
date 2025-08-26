import { Request, Response, type NextFunction } from "express";
import { getUserByEmail } from "./auth.service";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { generateAuthJWT } from "../../commons/jwt/auth.jwt";
import type { LoginSchemaProps } from "./schema/login.schema";
import type { RegisterSchemaProps } from "./schema/register.schema";
import { createUser, isEmailExist } from "../user/user.service";
import { ConflictException } from "../../commons/errors/custom.error";
import type { CreateUserProps } from "../user/types/user.type";
import { generateShortName } from "../../utils/utils";




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