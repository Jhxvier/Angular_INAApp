import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from './entities/Usuario';
import { Cliente } from './entities/Cliente';
import { Producto } from './entities/Producto';
import { Categoria } from './entities/Categoria';
import { Factura } from './entities/Factura';
import { DetalleFactura } from './entities/DetalleFactura';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'miappserver',
  synchronize: false,
  entities: [Usuario, Cliente, Producto, Categoria, Factura, DetalleFactura],
});
