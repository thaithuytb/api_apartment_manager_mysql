import { getRepository } from 'typeorm';
import { Room } from '../entities/Room';
import { ResponseType } from './../types/ResponseType';
import { RequestType } from './../types/RequestType';
import { Request } from 'express';
import { User } from '../entities/User';

const roomController = {
    getRoomDetail: async (req: RequestType, res: ResponseType<Room | User>) => {

        try {
            const user = await getRepository(User).findOne({
                select: ['userID','isAdmin', 'room'],
                where: {
                    userID: req.userID
                },
                relations: ['room']
            });
            if (user?.room.roomID === +req.params.id || user?.isAdmin) {
                console.log('a');
                const room = await getRepository(Room).findOne({
                    where: {
                        roomID: +req.params.id
                    },
                    relations: ['users']
                });
                if (room) {
                    return res.status(200).json({
                        success: true,
                        data: room
                    });
                }
            }
            return res.status(403).json({
                success: false,
                message: 'Not allowed'
            });

            
        } catch (error) {
            console.log(error);
        }
    },
    getAllRoom: async (req: Request, res: ResponseType<Room>) => {
        try {
            const rooms = await getRepository(Room).find({
                select: ['roomID', 'roomName']
            });
            if (rooms) {
                return res.status(200).json({
                    success: true,
                    data: rooms
                });
            }
            return res.send('null');
        } catch (error) {
            console.log(error);
        }
    },
    createRoom: async (req:RequestType, res: ResponseType<Room>) => {
        const { roomName, rentPrice, haveWifi, isEmpty } = req.body;
        console.log(req.body);
        if (!roomName) {
            return res.status(500).json({
                success: false,
                message: 'roomName is required'
            });
        }
        try {
            const checkRoom = await getRepository(Room).findOne({roomName});
            if (checkRoom) {
                return res.status(500).json({
                    success: false,
                    message: 'This room is existed'
                });
            }

            const newRoom = new Room();

            newRoom.roomName = roomName;
            newRoom.rentPrice = rentPrice;
            newRoom.haveWifi = haveWifi;
            newRoom.isEmpty = isEmpty;

            const room = await getRepository(Room).create(newRoom);
            const newRoomDB = await getRepository(Room).save(room);
            
            if(newRoomDB) {
                return res.status(201).json({
                    success: true,
                    data: newRoom
                });
            }

        } catch (error) {
            console.log(error);
        }
    },
    updateRoom: async (req: RequestType, res: ResponseType<Room>) => {
        try {  
            const room = await getRepository(Room).findOne({roomID: +req.params.id});
            if (room) {
                await getRepository(Room).merge(room, req.body);
                const newRoom = await getRepository(Room).save(room);
                if (newRoom) {
                    return res.status(200).json({
                        success: true,
                        data: newRoom
                    });
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    },
    deleteRoom: async (req: RequestType, res: ResponseType<Room>) => {
        try {
            const room = await getRepository(Room).delete({roomID: +req.params.id});
            if (room) {
                return res.status(203).json({
                    success: true,
                    message: 'This room deleted'
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default roomController;