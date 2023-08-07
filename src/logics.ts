import { Request,Response } from "express"
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";


const create = async (req: Request ,res:Response): Promise<Response> =>{

    const queryFormat: string = format(
        `
        INSERT INTO movies (%I)
        VALUES (%L)
        RETURNING *;
        `,
        Object.keys(req.body),
        Object.values(req.body)
    );

    const queryResult: QueryResult = await client.query(queryFormat)

    return res.status(201).json(queryResult.rows[0]);

}

const read = async (req: Request, res: Response): Promise<Response> => {
    const { category } = req.query;

    if (category === undefined) {
        const queryStringAll: string = `
            SELECT * FROM movies;
        `;

        const queryResultAll: QueryResult = await client.query(queryStringAll);

        return res.status(200).json(queryResultAll.rows);
    }

    const queryStringCategory: string = `
        SELECT * FROM movies
        WHERE category = $1;
    `;

    const queryResultCategory: QueryResult = await client.query(queryStringCategory, [category]);

    return res.status(200).json(queryResultCategory.rows);
};
    const update = async (req: Request ,res:Response): Promise<Response> => {
        const queryString: string = format(
            `
            UPDATE movies 
            SET (%I) = ROW (%L)
            WHERE id = $1
            RETURNING *;
            `,
            Object.keys(req.body),
            Object.values(req.body)
        );

        const queryResult: QueryResult = await client.query(queryString,[req.params.id,
        ]);
        
        return res.status(200).json(queryResult.rows[0])
    }

    const retrieveMovie = async ( req: Request, res: Response ): Promise<Response> => {
        const { foundMovie } = res.locals;
      
      
        return res.status(200).json(foundMovie);

      };

    const deleteMovie = async (req: Request ,res:Response): Promise<Response> => {

        const queryString:string = `
        DELETE FROM "movies"
        WHERE id = $1;
        `;

        await client.query(queryString, [req.params.id]);

        return res.status(204).json()
    }

 

    export default {create,read,update,retrieveMovie,deleteMovie}

    