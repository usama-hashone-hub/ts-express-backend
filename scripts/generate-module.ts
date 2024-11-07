import * as fs from "fs";
import * as path from "path";
const [n, ...t] = process.argv.slice(2);
if (!n) {
  console.error(
    "Please specify a module name: `npm run generate-module <module-name> <field-name>:<field-type>`"
  );
  process.exit(1);
}
const l = t.map((e) => {
    const [n, t] = e.split(":");
    return { name: n, type: t };
  }),
  d = (e) =>
    e
      .map((e) => {
        let t;
        switch (e.type.toLowerCase()) {
          case "string":
            t = "String";
            break;
          case "number":
            t = "Number";
            break;
          case "boolean":
            t = "Boolean";
            break;
          default:
            console.warn(
              `Unknown type '${e.type}' for field '${e.name}'. Defaulting to 'String'.`
            ),
              (t = "String");
        }
        return ` @Field(() => ${t})\n @prop()\n  ${
          e.name
        }: ${t.toLowerCase()};`;
      })
      .join("\n\n"),
  g = (e) =>
    e
      .map((e) => {
        let t;
        switch (e.type.toLowerCase()) {
          case "string":
            t = "String";
            break;
          case "number":
            t = "Number";
            break;
          case "boolean":
            t = "Boolean";
            break;
          default:
            console.warn(
              `Unknown type '${e.type}' for field '${e.name}'. Defaulting to 'String'.`
            ),
              (t = "String");
        }
        return `  @Field(() => ${t})\n  ${e.name}: ${t.toLowerCase()};`;
      })
      .join("\n\n"),
  p = path.resolve(__dirname, `../src/v1`, n),
  h = path.join(p, "graphql-apis"),
  m = path.join(p, "rest-apis");
function c(e, t) {
  fs.mkdirSync(path.dirname(e), { recursive: !0 }), fs.writeFileSync(e, t);
}
const u = `import{Resolver,Query,Mutation,Arg,ID}from'type-graphql';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Service}from'../${n}.service';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }}from'../${n}.schema';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input}from'./${n}.input';@Resolver(()=>${
    n.charAt(0).toUpperCase() + n.slice(1)
  })export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Resolver{private ${n}Service=new ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Service();@Query(()=>${
    n.charAt(0).toUpperCase() + n.slice(1)
  },{nullable:true})async ${n}(@Arg("id",()=>ID)id:string){return await this.${n}Service.findById(id)}@Mutation(()=>${
    n.charAt(0).toUpperCase() + n.slice(1)
  })async create${n.charAt(0).toUpperCase() + n.slice(1)}(@Arg("data")data:${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input){return await this.${n}Service.create(data)}@Mutation(()=>${
    n.charAt(0).toUpperCase() + n.slice(1)
  },{nullable:true})async update${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Arg("id",()=>ID)id:string,@Arg("data")data:${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input){return await this.${n}Service.update(id,data)}@Mutation(()=>Boolean)async delete${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Arg("id",()=>ID)id:string){await this.${n}Service.delete(id);return true}}`,
  i = `import{InputType,Field}from'type-graphql';@InputType()export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input{${g(l)}}`,
  y = `import{ObjectType,Field}from'type-graphql';@ObjectType()export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type{}`,
  r = `import{Controller,Route,Get,Post,Put,Delete,Body,Path}from'tsoa';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Service}from'../${n}.service';import{I${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Controller}from'./${n}.interface';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type}from'../graphql-apis/${n}.types';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input}from'../graphql-apis/${n}.input';@Route("${n}")export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Controller implements I${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Controller{private ${n}Service=new ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Service();@Get()public async list():Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type[]>{return await this.${n}Service.findAll()}@Post("/")public async create${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Body()data:${n.charAt(0).toUpperCase() + n.slice(1)}Input):Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type>{return await this.${n}Service.create(data)}@Get("/{id}")public async get${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Path()id:string):Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type|null>{return await this.${n}Service.findById(id)}@Put("/{id}")public async update${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Path()id:string,@Body()data:${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input):Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type|null>{return await this.${n}Service.update(id,data)}@Delete("/{id}")public async delete${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(@Path()id:string):Promise<void>{await this.${n}Service.delete(id)}}`,
  f = `import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type}from'../graphql-apis/${n}.types';import{${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input}from'../graphql-apis/${n}.input';export interface I${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Controller{create${n.charAt(0).toUpperCase() + n.slice(1)}(data:${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input):Promise<${n.charAt(0).toUpperCase() + n.slice(1)}Type>;get${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(id:string):Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Type|null>;update${n.charAt(0).toUpperCase() + n.slice(1)}(id:string,data:${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Input):Promise<${n.charAt(0).toUpperCase() + n.slice(1)}Type|null>;delete${
    n.charAt(0).toUpperCase() + n.slice(1)
  }(id:string):Promise<void>;}`,
  s = `import{${n.charAt(0).toUpperCase() + n.slice(1)},${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model}from'./${n}.schema';import{DocumentType}from'@typegoose/typegoose';export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Service{async findAll():Promise<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }[]>{return ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model.find()}async create(data:Partial<DocumentType<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }>>):Promise<DocumentType<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }>>{const item=new ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model(data);return await item.save()}async findById(id:string):Promise<DocumentType<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }>|null>{return ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model.findById(id).exec()}async update(id:string,data:Partial<DocumentType<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }>>):Promise<DocumentType<${
    n.charAt(0).toUpperCase() + n.slice(1)
  }>|null>{return ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model.findByIdAndUpdate(id,data,{new:true}).exec()}async delete(id:string):Promise<void>{await ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model.findByIdAndDelete(id).exec()}}`,
  a = `import{getModelForClass,prop}from'@typegoose/typegoose';import{ObjectType,Field}from"type-graphql";@ObjectType()export class ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }{${d(l)}}export const ${
    n.charAt(0).toUpperCase() + n.slice(1)
  }Model=getModelForClass(${n.charAt(0).toUpperCase() + n.slice(1)});`;
c(path.join(p, `${n}.schema.ts`), a),
  c(path.join(p, `${n}.service.ts`), s),
  c(path.join(h, `${n}.input.ts`), i),
  c(path.join(h, `${n}.types.ts`), y),
  c(path.join(m, `${n}.interface.ts`), f),
  c(path.join(h, `${n}.resolver.ts`), u),
  c(path.join(m, `${n}.controller.ts`), r),
  console.log(`${n} module generated successfully in src folder.`);
