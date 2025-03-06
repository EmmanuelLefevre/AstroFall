'use server'

import { CollectionName } from '@/lib/collection.enum';
import { connectToDatabase } from '@/lib/mongodb';
import { Meteorite } from "@/lib/interfaces/meteorite-interface";


export async function getAllMeteorite(): Promise<Meteorite[]> {
	try {
		const db = await connectToDatabase();

		const MeteoriteDatas: Meteorite[] = await db.collection<Meteorite>(CollectionName.METEORITE_FRONT)
			.find({})
			.toArray();

		const result =  MeteoriteDatas.map((MeteoriteData) => ({
			...MeteoriteData,
			_id: MeteoriteData?._id?.toString()
		}));

		return result;
	}

	catch (error) {
		console.error('💣 Get data errror : ', error);
		throw error;
	}
}
