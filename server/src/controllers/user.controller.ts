import { Request } from 'express';
import { User } from '../entities/User';
import { getRepository } from 'typeorm';
import { ResponseType } from '../types/ResponseType';
import { Secret, sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { Room } from '../entities/Room';
import { RequestType } from './../types/RequestType';

const userController = {
    loginUser: async (req: Request, res: ResponseType<User>) => {
        const { phoneNumber, password } = req.body;
        try {
            const user =  await getRepository(User).findOne({
                select: ['userID','fullName','phoneNumber', 'room', 'password'],
                where: {
                    phoneNumber
                },
                relations: ['room'],
            });
            if ( !user ) {
                return res.status(400).json({
                    success: false,
                    message: 'phoneNumber or password is incorrect'
                });
            }
            const checkPassword = await verify(user.password, password);
            if (!checkPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'phoneNumber or password is incorrect'
                });
            }
            const token = await sign({ id: user.userID }, process.env.ACCESS_TOKEN_SECRET as Secret, {
                expiresIn: '1h'
            });

            return res.status(200).json({
                success: true,
                data: user,
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
                    const newRoom: Room = {...room, isEmpty: false};
                    if (room.isEmpty){
                        await getRepository(Room).save(newRoom);       
                    }
                    return res.status(201).json({
                        success: true,
                        message: `phoneNumber: ${newUser.phoneNumber} registered successfully !!!`
                    });
                }
            }            
        } catch (error) {
            console.log(error);
        }    
    },
    getDetailUser: async (req: RequestType, res: ResponseType<User>) => {
        try {
            const user = await getRepository(User).findOne({
                select: ['userID','fullName', 'phoneNumber','sex','cardNumber','dateOfBirth','address','haveMotorbike'],
                where: {
                    userID: req.userID
                }
            })
            if ( user ) {
                return res.status(200).json({
                    success: true,
                    data: user
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    updateDetailUser: async (req: RequestType, res: ResponseType<User>) => {
        try {
            const user = await getRepository(User).findOne({ userID: req.userID});
            if (user) {
                const detailUser: User = {...user, ...req.body};
                const newUser = await getRepository(User).save(detailUser);
                if (newUser) {
                    return res.status(200).json({
                        success: true,
                        message: 'update successful',
                        data: newUser
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    changePassword: async (req: RequestType, res: ResponseType<User>)=> {
        try {
            const { password, newPassword} = req.body;
            const user = await getRepository(User).findOne({
                where: {
                    userID: req.userID
                }
            });
            if (user) {
                const checkPassword = await verify(user.password, password);
                const newPasswordHash = await hash(newPassword);
                if (checkPassword) {
                    const newUser:User = {...user, password: newPasswordHash};
                    
                    const newUserDB = await getRepository(User).save(newUser);
                    if (newUserDB) {
                        return res.status(200).json({
                            success: true,
                            message: 'Change password successfully!!!'
                        })
                    }
                }
                return res.status(500).json({
                    success: false,
                    message: 'Password is incorrected !!!',
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default userController;