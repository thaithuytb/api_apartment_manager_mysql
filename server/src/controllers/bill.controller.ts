import { Bill } from "../entities/Bill";
import { RequestType } from "../types/RequestType";
import { ResponseType } from './../types/ResponseType';

const billController = {
    getBillDetail: (req: RequestType, res: ResponseType<Bill>) => {
        try {
            console.log('a')
        } catch (error) {
            console.log(error);
        }
    },

};

export default billController;