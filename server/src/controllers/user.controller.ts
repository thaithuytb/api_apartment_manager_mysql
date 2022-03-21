import { Request } from 'express';
import { User } from '../entities/User';
import { getRepository } from 'typeorm';
import { ResponseType } from '../types/ResponseType';
import { Secret, sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { Room } from '../entities/Room';

const userController = {
    loginUser: async (req: Request, res: ResponseType<User>) => {
        const { phoneNumber, password } = req.body;
        try {
            const checkUser =  await getRepository(User).findOne({phoneNumber});
            if ( !checkUser ) {
                return res.status(400).json({
                    success: false,
                    message: 'phoneNumber or password is incorrect'
                });
            }
            const checkPassword = await verify(checkUser.password, password);
            if (!checkPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'phoneNumber or password is incorrect'
                });
            }
            const token = await sign({ id: checkUser.userID }, process.env.ACCESS_TOKEN_SECRET as Secret, {
                expiresIn: '1h'
            });

            return res.status(200).json({
                success: true,
                data: checkUser,
                token
            });

           
        } catch (error) {
            console.log(error);
        }    
    },
    registerUser: async (req:Request, res: ResponseType<User>) => {
        const { phoneNumber, password, isAdmin, roomID } = req.body;
        try {
            const checkUser = await getRepository(User).findOne({phoneNumber});
            if (checkUser) {
                return res.status(400).json({
                    success: false,
                    message: 'PhoneNumber already exists'
                });
            }
            const hashPassword =  await hash(password);
            const room = await getRepository(Room).findOne(roomID);
            if (room) {
                const newUser = new User();
                newUser.phoneNumber = phoneNumber;
                newUser.isAdmin = isAdmin;
                newUser.password = hashPassword;
                newUser.room = room;

                const user = await getRepository(User).create(newUser);
                const newUserDb = await getRepository(User).save(user);
                if (newUserDb) {
                    const token = await sign({ id: newUserDb.userID }, process.env.ACCESS_TOKEN_SECRET as Secret, {
                        expiresIn: '1h'
                    });
                    return res.status(201).json({
                        success: true,
                        data: user,
                        token
                    });
                }
            }            
        } catch (error) {
            console.log(error);
        }    
    },
    // deleteUser: async (req: Request, res: Response) => {
    //     try {
    //         const deleteUser = await getRepository(User).delete(req.params.id);
    //         return res.json({
    //             success: true,
    //             user: deleteUser
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    // updateUser: async (req: Request, res: Response) => {
    //     try {
    //         const user = await getRepository(User).findOne(req.params.id);
    //         if (user) {
    //             await getRepository(User).merge(user, req.body);
    //             const updateUser = await getRepository(User).save(user);
    //             return res.json({
    //                 success: true,
    //                 user: updateUser
    //             });
    //         }        
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
};

export default userController;