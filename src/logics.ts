import { Request,Response } from "express"
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";
import { movieResult } from "./interface";


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
    const {category} = req.query;

    const queryConfig: QueryConfig = {
        text:`
        SELECT * FROM movies
        WHERE category = $1;
         `,

         values:[category]
    }

    let result: movieResult = await client.query(queryConfig);

    if(!result.rowCount){
             result = await client.query(`SELECT * FROM movies;`)
    }

    return res.status(200).json(result.rows);  
    
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

    