import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {AuthDto, AuthDtoType} from "../dtos/auth.dto";
import {AuthService} from "../services/auth.service";

const authService = new AuthService();

export const AuthController = async (
    req: Request<object, object, AuthDtoType>,
    res: Response
) => {
    // Validation du body avec Zod
    const parseResult = AuthDto.safeParse(req.body);

    if (!parseResult.success) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: "No Email provided or invalid format"});
    }

    const {email} = parseResult.data;
    const token = await authService.generateToken(email);
    res.status(StatusCodes.OK).json({token});

};