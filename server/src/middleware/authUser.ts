import { NextFunction, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { RequestType } from '../types/RequestType';
import { TokenType } from '../types/TokenType';

const authUser = async (req : RequestType, res: Response, next: NextFunction) => {
    const headerDate = req.headers.authorization;
    const token = headerDate && headerDate.split(' ')[1];

    try {
        if (token) {
            const decoden = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as TokenType;
            if (decoden) {
                req.userID = decoden.id;
                next();
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export default authUser;