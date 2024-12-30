// 1. Cantidad de cines (theaters) por estado.
use("mflix");
db.theaters.find();

use("mflix");
db.theaters.aggregate([
    { $group: { _id: "$location.address.state", totalTheaters: { $sum: 1 } } }
]);
//----------------------------------------------------------------
use("mflix");
db.theaters.aggregate([
    { $group: { _id: "$location.address.state", totalTheaters: { $sum: 1 }}},
    { $project: {
            "_id": 0,
            "state": "$_id",    // reemplazamos _id para que muestre state 
            "totalTheaters": 1
        }
    },
    { $sort: { totalTheaters: -1 } }
]);

// ===============================================================================
// 2. Cantidad de estados con al menos dos cines (theaters) registrados.
use("mflix");
db.theaters.find();

use("mflix");
db.theaters.aggregate([
    {$group: { _id: "$location.address.state", totalTheaters: { $sum: 1 } } },

    // Filtra los estados con al menos dos cines
    { $match: { totalTheaters: { $gte: 2 } } },    
    { $project: { _id: 0, state: "$_id", totalTheaters: 1 } },
    { $sort: { totalTheaters: 1 } }
]);


// ===============================================================================
// 3. Cantidad de películas dirigidas por "Louis Lumière". Se puede responder 
// sin pipeline de agregación, realizar ambas queries.

use("mflix");
db.movies.find( {directors: "Louis Lumière"} );

use("mflix");
db.movies.find({ directors: "Louis Lumière" }).count();

use("mflix");
db.movies.aggregate( [
    { $match: {directors:"Louis Lumière" } },
    { $group : { _id: null, count : { $sum: 1 } } } 
]);

// ===============================================================================
// 4. Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959). 
//    Se puede responder sin pipeline de agregación, realizar ambas queries.

use("mflix");
db.movies.find();

use("mflix");
db.movies.find({year: {$gte:1950, $lte: 1959}}).count();


use("mflix");
db.movies.aggregate([
    // Filtra los años de estreño
    { $match: {year: {$gte:1950, $lte: 1959} } },
    { $group: {_id: null, count: { $sum: 1 } }}
]);

// ===============================================================================
// 5. Listar los 10 géneros con mayor cantidad de películas 
//   (tener en cuenta que las películas pueden tener más de un género). 
//   Devolver el género y la cantidad de películas. Hint:unwind puede ser de utilidad

use("mflix");
db.movies.find();

use("mflix");
db.movies.aggregate([
    // Descompone el arreglo por genres por cada genero
    { $unwind: "$genres" },
    // Cuenta la cantidad de generos por pelicula
    { $group: { _id: "$genres", count: { $sum: 1} }},
    { $limit: 10 },
    { $sort: { count: -1 }}
]);

// ===============================================================================
// 6. Top 10 de usuarios con mayor cantidad de comentarios, 
// mostrando Nombre, Email y Cantidad de Comentarios

use("mflix");
db.comments.find();

use("mflix");
db.comments.aggregate([
    { $group: {_id: {name:"$name", email: "$email"}, comments: { $sum:1 } }},
    // Filtramos de que muestre mejor los resultados
    { $project: {_id: 0, name:"$_id.name", email: "$_id.email", comments: 1}},
    { $limit: 10},
    { $sort: { comments: -1 }}
]);

// ===============================================================================
// 7. Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas 
// en los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio 
// del año.

use("mflix");
db.movies.find();

use("mflix");
db.movies.aggregate([
    { $match: { year: {$gte:1980, $lte: 1989}}},
    { $group: {"_id": "$year",
               "avg_imdbRating": {"$avg": "$imdb.rating"}, 
               "min_imdbRating": {"$min": "$imdb.rating"},
               "max_imdbRating": {"$max": "$imdb.rating"}}},
    { $sort: {"avg_imdbRating": -1}}
]);

// ===============================================================================
// 8. Título, año y cantidad de comentarios de las 10 películas con más comentarios.
use("mflix");
db.movies.find();

use("mflix");
db.movies.aggregate([
    { $group: {_id: {title: "$title", year: "$year"}, comments: { $sum: "$num_mflix_comments" }}},
    { $project: {_id: 0, title: "$_id.title", year: "$_id.year", comments: 1}},
    { $sort: {comments: -1}},
    { $limit: 10}
]);

// ===============================================================================
// 9. Crear una vista con los 5 géneros con mayor cantidad de comentarios, 
// junto con la cantidad de comentarios.

// Usaremos db.createView() para crear una vista
use("mflix");
db.createView(
  "genres_comments", 
  "movies", [
    // Descompone el arreglo por genres por cada genero
    { $unwind: "$genres" },
    { $group: {_id: "$genres", comments: {$sum: "$num_mflix_comments"}}},
    { $sort: { comments: -1 } }, 
    { $limit: 5 }
  ]
);
// Consultamos la vista
use("mflix");
db.genres_comments.find();

// Es lo mismo pero con aggregate:
use("mflix");
db.movies.aggregate([
    // Descompone el arreglo por genres por cada genero
    { $unwind: "$genres" },
    { $group: {_id: "$genres", comments: {$sum: "$num_mflix_comments"}}},
    { $sort: { comments: -1 } }, 
    { $limit: 5 }
]);


// ===============================================================================
// 10. Listar los actores (cast) que trabajaron en 2 o más películas 
// dirigidas por "Jules Bass". Devolver el nombre de estos actores junto 
// con la lista de películas (solo título y año) dirigidas por “Jules Bass”
// en las que trabajaron.
// a. Hint1: addToSet
// b. Hint2: {'name.2': {$exists: true}} permite filtrar arrays 
// con al menos 2 elementos, entender por qué.
// c. Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta



// ===============================================================================
// 11. Listar los usuarios que realizaron comentarios durante el mismo mes de 
// lanzamiento de la película comentada, mostrando Nombre, Email, 
// fecha del comentario, título de la película, fecha de lanzamiento. 
// HINT: usar $lookup con multiple condiciones


use("mflix");
db.users.find();

use("mflix");
db.comments.find();

use("mflix");
db.movies.find();

use("mflix");
db.comments.find();


use("mflix");
db.movies.aggregate([
    { $lookup: {
            from: "comments", // indica la coleccion a unir
            localField: "_id",  // indica el campo de la coleccion actual
            foreignField: "movie_id", // indica el campo de la coleccion a unir
            as: "comments"  // Define el nombre del campo que se va a agregar
        }
    },
    // filtramos los comentarios que se realizaron el mismo mes de lanzamiento de la pelicula
    { $match: { $expr: { $eq: [{ $month: "$released" }, { $month: { $arrayElemAt: ["$comments.date", 0] } }] } } },
    // proyectamos los campos que queremos mostrar
    { $project: { _id: 0, name: 1, email: 1, date: { $arrayElemAt: ["$comments.date", 0] }, title: 1, released: 1 } },
    { $limit: 10 },
    { $sort: { date: -1 } }
]);

use("mflix");
db.comments.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "movie_id",
        foreignField: "_id",
        as: "commentedMovies"
      }
    },
    {   
      $unwind: "$commentedMovies"
    },
    {
      $match: {
        $expr: {
          $eq: [
            { $month: "$date" },
            { $month: "$commentedMovies.releaseDate" }
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        commentDate: "$date",
        movieTitle: "$commentedMovies.title",
        releaseDate: "$commentedMovies.releaseDate"
      }
    }
  ]);
    


// ===============================================================================
// 12. Listar el id y nombre de los restaurantes junto con su puntuación máxima, 
// mínima  y la suma total. Se puede asumir que el restaurant_id es único.
// a. Resolver con $group y accumulators.
// b. Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
// c. Resolver como en el punto b) pero usar $reduce para calcular la puntuación
// total.
// d. Resolver con find.

use("restaurantdb");
db.restaurants.find();

use("restaurantdb");
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: {_id: "$restaurant_id",
                "name": {"$first": "$name"},
                "max_score": {"$max": "$grades.score"},
                "min_score": {"$min": "$grades.score"},
                "suma_total": {"$sum": "grades.score"}
            }
    },
    { $project: { "_id": 0, "name":1, "max_score":1, "min_score":1, "suma_total": 1}}
]);


// ===============================================================================
// 13. Actualizar los datos de los restaurantes añadiendo dos campos nuevos.
// a. "average_score": con la puntuación promedio
// b. "grade": con "A" si "average_score" está entre 0 y 13,
// con "B" si "average_score" está entre 14 y 27
// con "C" si "average_score" es mayor o igual a 28
// Se debe actualizar con una sola query.
// a. HINT1. Se puede usar pipeline de agregación con la operación update
// b. HINT2. El operador $switch o $cond pueden ser de ayuda.