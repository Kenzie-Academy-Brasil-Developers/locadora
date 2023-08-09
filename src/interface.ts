import { QueryResult } from "pg";

type movie ={
id:number;
name:string;
category:string;
duration:number;
price:number;
};

type movieResult = QueryResult<movie>
export {movie, movieResult}