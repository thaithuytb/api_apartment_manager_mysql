import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './Room';

@Entity({name: 'users'})

export class User {
    @PrimaryGeneratedColumn()
        userID!: number;

    @Column({
        nullable: true
    })
        fullName: string;

    @Column({
        unique: true
    })
        phoneNumber!: string;
    
    @Column()
        password!: string;
        
    @Column({
        nullable: true
    })
        sex: string;

    @Column({
        nullable: true
    }
    )
        cardNumber: number;
    
    @Column({
        nullable: true
    })
        dateOfBirth: Date;

    @Column({
        nullable: true
    })
        address: string;
    
    @Column()
        isAdmin!: boolean;

    @Column({
        nullable: true
    })
        haveMotorbike: boolean;

    @CreateDateColumn()
        createAt!: Date;

    @UpdateDateColumn()
        updateAt!: Date;

    @ManyToOne(() => Room, room => room.users)
    @JoinColumn({ name: 'roomID' })
        room: Room;
    // @JoinColumn()
        // profile: ProfileUser;
    //create a foreign key have name profileID
}