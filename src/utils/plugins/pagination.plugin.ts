import { Document, Model, Schema } from "mongoose";

interface QueryOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

async function paginate(schema: Schema) {
  schema.statics.paginate = async function <T extends Document>(
    this: Model<T>,
    filter: Record<string, any>,
    options: QueryOptions,
    select: Record<string, any> = {}
  ): Promise<QueryResult<T>> {
    let sort = "";
    if (options?.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(",").forEach((sortOption: string) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit = options?.limit && options?.limit > 0 ? options?.limit : 10;
    const page = options?.page && options?.page > 0 ? options?.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options?.populate) {
      docsPromise = docsPromise.populate(options.populate);
    }

    const docs = docsPromise.select(select).exec();

    const [totalResults, results] = await Promise.all([countPromise, docs]);
    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
}

export default paginate;
