import { getRepository } from 'typeorm';
import { Room } from '../entities/Room';
import { ResponseType } from './../types/ResponseType';
import { RequestType } from './../types/RequestType';
import { Request } from 'express';

const roomController = {
    //GET: ../room/:roomID
    getRoomDetail: async (req: RequestType, res: ResponseType<Room>) => {
        try {
            const room = await getRepository(Room).findOne({
                where: {
                    roomID: +req.params.roomID
                },
                relations: ['users']
            });
            if (room) {
                return res.status(200).json({
                    success: true,
                    data: room
                });
            }
            
            return res.status(404).json({
                success: false,
                message: 'Room not found !!!'
            });

            
        } catch (error) {
            console.log(error);
        }
    },
    //GET: .../room
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
            return res.status(404).json({
                success: false,
                message: 'Rooms not found !!!'
            });
        } catch (error) {
            console.log(error);
        }
    },
    //POST .../room
    createRoom: async (req:RequestType, res: ResponseType<Room>) => {
        const { roomName, rentPrice, haveWifi, isEmpty } = req.body;
        if (roomName === undefined) {
            return res.json({
                success: false,
                message: 'roomName is required'
            });
        }
        try {
            const checkRoom = await getRepository(Room).findOne({roomName});
            if (checkRoom) {
                return res.json({
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
    //PUT: .../room/:id
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
            return res.status(404).json({
                success: false,
                message: 'Room not found !!!'
            });
            
        } catch (error) {
            console.log(error);
        }
    },
    //DELETE: .../room/:id
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