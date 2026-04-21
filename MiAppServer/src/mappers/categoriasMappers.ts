import { Categoria } from "../entities/Categoria";
import { CategoriaResponseDto } from "../dtos/categoriaDto";

//CLASE QUE MAPEARA DE CATEGORIA A CATEGORIARESPONSEDTO
export class CategoriaMapper {
  //METODO QUE CONVIERTE DE CATEGORIA A CATEGORIARESPONSEDTO
  static toCategoriaResponseDto(entiry: Categoria): CategoriaResponseDto {
    return {
      id: entiry.id,
      nombre: entiry.nombre,
      descripcion: entiry.descripcion || undefined,
    };
  }

  //METODO QUE CONVIERTE UNA LISTA DE CATEGORIAS A CATEGORIARESPONSEDTO
  static toCategoriaResponseDtoList(
    entities: Categoria[],
  ): CategoriaResponseDto[] {
    return entities.map(this.toCategoriaResponseDto);
  }
}
