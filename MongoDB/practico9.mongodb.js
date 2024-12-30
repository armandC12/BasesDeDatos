// 1. Especificar en la colección users las siguientes reglas de validación: 
// El campo name (requerido) debe ser un string con un máximo de 30 caracteres, 
// email (requerido) debe ser un string que matchee con la expresión 
// regular: "^(.*)@(.*)\\.(.{2,4})$" , 
// password (requerido) debe ser un string con al menos 50 caracteres.

use("mflix");
db.users.find();

use("mflix");
db.runCommand( { 
    collMod: "users", 
    validator: { $jsonSchema : {
        bsonType: "object",
        required: [ "name", "email", "password" ],
        properties: {
            name: {
                bsonType: "string",
                maxLength: 30,
                description: "must be a string and is required and max 30 characters"
            },
            email: {
                bsonType: "string",
                pattern: "^(.*)@(.*)\\.(.{2,4})$",
                description: "msut be a string and is required and match with the regular expression"
            },
            password: {
                bsonType: "string",
                minLength: 50,
                description: "must be a string and is required and at least 50 characters"
            }
        }
    } },
    validationLevel: "moderate"
} );

//// DOMCUMENTOs VALIDOS
// use("mflix");
// db.users.insert([
//     {
//       "name": "John Doe",
//       "email": "john.doe@example.com",
//       "password": "a_secure_password_that_is_long_enough"
//     },
//     {
//       "name": "Jane Smith",
//       "email": "jane.smith@example.com",
//       "password": "another_secure_password"
//     },
//     // Agrega otros documentos válidos aquí
//   ]);
// ======================================================================
//// DOCUMENTOS INVALIDOS
// Documento inválido por exceder la longitud máxima del campo "name"
// use("mflix");
// db.users.insert({
//     "name": "ThisNameIsWayTooLongAndExceedsTheMaximumLength",
//     "email": "test@example.com",
//     "password": "a_secure_password"
//   });
  
//   // Documento inválido por no cumplir con la expresión regular del campo "email"
//   db.users.insert({
//     "name": "Invalid User",
//     "email": "invalid_email",
//     "password": "a_secure_password"
//   });
  
//   // Documento inválido por no cumplir con la longitud mínima del campo "password"
//   db.users.insert({
//     "name": "Short Password",
//     "email": "test@example.com",
//     "password": "short_pw"
//   });
  
//=====================================================================

// 2. Obtener metadata de la colección users que garantice que las reglas 
//    de validación fueron correctamente aplicadas.

use("mflix");
db.users.find();

use("mflix");
db.users.runCommand({collStats: "users"});

use("mflix");
db.getCollectionInfos();

//=====================================================================

// 3. Especificar en la colección theaters las siguientes reglas de validación: 
// El campo theaterId (requerido) debe ser un int 
// y  location (requerido) debe ser  un object con:
// a. un campo address (requerido) que sea un object con campos 
// street1, city, state y zipcode todos de tipo string y requeridos
// b. un campo geo (no requerido) que sea un object con un campo type, 
// con valores posibles “Point” o null y coordinates que debe ser una 
// lista de 2 doubles
// Por último, estas reglas de validación no deben prohibir ç
// la inserción o actualización de documentos que no las cumplan sino 
// que solamente deben advertir.

use("mflix");
db.theaters.find();

use("mflix");
db.runCommand( { 
    collMod: "theaters", 
    validator: { $jsonSchema : {
        bsonType: "object",
        required: [ "theaterId", "location" ],
        properties: {
            theaterId: {
                bsonType: "int",
                description: "must be a int and is required"
            },
            location: {
                bsonType: "object",
                required: [ "address" ],
                description: "must be a object and is required",
                properties:{
                    address: {
                        bsonType: "object",
                        required: [ "street1", "city", "state", "zipcode" ],
                        description: "must be a string and is required",
                        properties: {
                            street1: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            city: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            state: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            zipcode: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    },
                    geo: {
                        bsonType: "object",
                        required: [ "type", "coordinates" ],
                        description: "must be a string and is not required",
                        properties:{
                            type: {
                                enum: [ "Point", null ],
                                description: "can only be one of the enum values and is not required"
                            },
                            coordinates: {
                                bsonType: "array",
                                // el items es para validar el tipo de dato de los elementos del array
                                items: {
                                    bsontype: "double"
                                },
                                description: "must be a string and is not required"
                            }
                        }
                    }
                }
            }
        }
    } },
    validationLevel: "moderate",
    validationAction: "warn"
} );

//=====================================================================

// 4. Especificar en la colección movies las siguientes reglas de validación: El campo title
// (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000,
// y que tanto cast, directors, countries, como genres sean arrays de strings sin
// duplicados.
// a. Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora
// de insertar documentos. Recordar que mongo shell es un intérprete javascript y
// en javascript los literales numéricos son de tipo Number (double).

use("mflix");
db.runCommand({
    collMod: "movies",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "title", "year", "cast", "directors", "countries", "genres" ],
            properties: {
                title: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                year: {
                    bsonType: "int",
                    minimum: 1900,
                    maximum: 3000,
                    description: "must be a int and is required"
                },
                cast: {
                    bsonType: "array",
                    description: "must be a array and is required"
                },
                directors: {
                    bsonType: "array",
                    description: "must be a date and is required"
                },
                countries: {
                    bsonType: "array",
                    description: "must be a array and is required"
                },
                genres: {
                    bsonType: "array",
                    uniqueItems: true,  // garantiza que no haya elementos duplicados en el array
                    description: "must be a string and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});

// =====================================================================
// 5. Crear una colección userProfiles con las siguientes reglas de validación: Tenga un
// campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno
// de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo
// favorite_genres (no requerido) que sea un array de strings sin duplicados.

use("mflix");
db.createCollection("userProfiles", {
    validator: {
        $jsonSchema :{
            bsonType: "object",
            required: [ "user_Id", "language"],
            properties: {
                user_Id: {
                    bsonType: "objectId",
                    description: "must be a objectId and is required"
                },
                language:{
                    enum: ["English", "Spanish", "Portuguese"],
                    description: "can only be one of the enum values and is required"
                },
                favorite_genres: {
                    bsonType: "array",
                    uniqueItems: true,  // garantiza que no haya elementos duplicados en el array
                    description: "must be a array sin duplicate and is not required",
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});

use("mflix");
db.userProfiles.find();

// insercion de documentos validos
use("mflix");
db.userProfiles.insertMany([
    {
        "user_Id": ObjectId("5f9d5c1a1c9d440000c6a9d6"),
        "language": "English",
        "favorite_genres": ["Action", "Drama"]
    },
    {
        "user_Id": ObjectId("5f9d5c1a1c9d440000c6a9d7"),
        "language": "Spanish",
        "favorite_genres": ["Action", "Drama"]
    },
    {
        "user_Id": ObjectId("5f9d5c1a1c9d440000c6a9d8"),
        "language": "Portuguese",
        "favorite_genres": ["Action", "Drama"]
    }
]);

// insercion de un documento con campo faltante
use("mflix");
db.userProfiles.insertOne({
    "user_Id": ObjectId("5f9d5c1a1c9d440000c6a9d9"),
});

// insercion de un documento con valor no permitido para "language"
use("mflix");
db.userProfiles.insertOne({
    user_id: ObjectId(), // Puedes generar un ObjectId válido
    language: "French", // Debe ser uno de los valores permitidos: ["English", "Spanish", "Portuguese"]
    favorite_genres: ["Comedy"]
  });

// =====================================================================

// Modelado de datos en MongoDB
// 6. Identificar los distintos tipos de relaciones (One-To-One, One-To-Many) en las
// colecciones movies y comments. 
// Determinar si se usó documentos anidados o referencias en cada relación y justificar la razón.

use("mflix");
db.movies.find();

use("mflix");
db.comments.find();
// ¿Como identifico los distintos tipos de relaciones (One-To-One, One-To-Many) en las colecciones movies y comments?
// RESPUESTA:
// En la coleccion movies se usa relacion One-To-Many con la coleccion comments.
// En la coleccion comments se usa relacion Many-To-One con la coleccion movies.
// Un ejemplo?
// En la coleccion movies, el campo "comments" es un array de objetos que tienen la estructura:
// {
//     "name": "John Doe",
//     "email": "
//     "text": "I loved this movie!",
//     "date": ISODate("2014-01-01T00:00:00Z"),
// }
// En la coleccion comments, el campo "movie_id" es un ObjectId que referencia a un documento de la coleccion movies.
// {
//     "name": "John Doe",
//     "email": "
//     "text": "I loved this movie!",
//     "movie_id": ObjectId("5f9d5c1a1c9d440000c6a9d6") // referencia a un documento de la coleccion movies
// }
// {
//     "name": "Jane Smith",
//     "email": "
//     "text": "I loved this movie!",
//     "movie_id": ObjectId("5f9d5c1a1c9d440000c6a9d6") // referencia a un documento de la coleccion movies
// }

// ¿como determino si se usó documentos anidados o referencias en cada relación y justificar la razón?
// RESPUESTA:
// En la coleccion movies se usa documentos anidados para la relacion One-To-Many con la coleccion comments.
// En la coleccion comments se usa referencias para la relacion Many-To-One con la coleccion movies.


// =====================================================================

// 7. Dado el diagrama de la base de datos shop junto con las queries más importantes.
// Queries
// I. Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
// II. Cantidad de libros por categorías
// III. Listar el nombre y dirección entrega y el monto total (quantity * price) de sus
// pedidos para un order_id dado.

// Debe crear el modelo de datos en mongodb aplicando las estrategias “Modelo de datos
// anidados” y Referencias. El modelo de datos debe permitir responder las queries de
// manera eficiente.

// Inserte algunos documentos para las colecciones del modelo de datos. Opcionalmente
// puede especificar una regla de validación de esquemas para las colecciones.

// Se provee el archivo shop.tar.gz que contiene algunos datos que puede usar como
// ejemplo para los inserts en mongodb



// La base de datos shop tiene las siguientes colecciones: orders, order_details, books y categories.
// Primero creamos el modelo de datos, aplicando las estrategias “Modelo de datos anidados” y Referencias.
use("shop");
db.createCollection("orders");
db.createCollection("order_details");
db.createCollection("books");
db.createCollection("categories");

// Ahora insertamos algunos documentos para las colecciones del modelo de datos.
// Siguiendo estos datos:
// DROP DATABASE IF EXISTS `shop`;
// CREATE DATABASE `shop`;
// CREATE TABLE `shop`.`categories` (
//   `category_id` int NOT NULL AUTO_INCREMENT,
//   `category_name` varchar(70) NOT NULL, 
//   PRIMARY KEY (`category_id`),
//   KEY `category_id_key` (`category_id`)
//   );
// CREATE TABLE `shop`.`books` (
//   `book_id` int NOT NULL AUTO_INCREMENT,
//   `title` varchar(70) NOT NULL,
//   `author` varchar(70) DEFAULT NULL,
//   `price` double NOT NULL,
//   `category_id` int NOT NULL,
//   PRIMARY KEY (`book_id`),
//   KEY `book_id_key` (`book_id`),
//   CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
// );
// CREATE TABLE `shop`.`orders` (
//   `order_id` bigint NOT NULL AUTO_INCREMENT,
//   `delivery_name` varchar(70) NOT NULL,
//   `delivery_address` varchar(70) NOT NULL,
//   `cc_name` varchar(70) NOT NULL,
//   `cc_number` varchar(32) NOT NULL,
//   `cc_expiry` varchar(20) NOT NULL,
//   PRIMARY KEY (`order_id`),
//   KEY `order_id_key` (`order_id`)
// );
// CREATE TABLE `shop`.`order_details` (
//   `id` bigint NOT NULL AUTO_INCREMENT,
//   `book_id` int NOT NULL,
//   `title` varchar(70) NOT NULL,
//   `author` varchar(70) DEFAULT NULL,
//   `quantity` int NOT NULL,
//   `price` double NOT NULL,
//   `order_id` bigint NOT NULL,
//   PRIMARY KEY (`id`),
//   KEY `order_details_id_key` (`id`),
//   CONSTRAINT `book_id` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
//   CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
// ); 

// booksINSERT INTO `shop`.`categories` (`category_id`, `category_name`) VALUES ('1', 'Web Development');
// INSERT INTO `shop`.`categories` (`category_id`, `category_name`) VALUES ('2', 'Science Fiction');
// INSERT INTO `shop`.`categories` (`category_id`, `category_name`) VALUES ('3', 'Historical Mysteries');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('1', 'Learning MySQL', 'Jesper Wisborg Krogh', '34.31', '1');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('2', 'JavaScript Next', 'Raju Gandhi', '36.70', '1');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('3', 'The Complete Robot', 'Isaac Asimov', '12.13', '2');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('4', 'Foundation and Earth', 'Isaac Asimov', '11.07', '2');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('5', 'The Da Vinci Code', 'Dan Brown', '7.99', '3');
// INSERT INTO `shop`.`books` (`book_id`, `title`, `author`, `price`, `category_id`) VALUES ('6', 'A Column of Fire', 'Ken Follett', '6.99', '3');

// Creamos categorias pero tambien aplicaremos la regla de validacion para que no se puedan insertar documentos que no cumplan con la regla de validacion
use("shop");
db.runCommand({
    collMod: "categories",
    validator: {
        $jsonSchema :{
            bsonType: "object",
            required: [ "category_id", "category_name"],
            properties: {
                category_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                category_name: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});
// Insertamos documentos validos
use("shop");
db.categories.insertMany([
    {
        "category_id": 1,
        "category_name": "Web Development"
    },
    {
        "category_id": 2,
        "category_name": "Science Fiction"
    },
    {
        "category_id": 3,
        "category_name": "Historical Mysteries"
    }
]);
// corroboramos que se insertaron los documentos
use("shop");
db.categories.find();

// Para books hacemos lo mismo
use("shop");
db.books.runCommand({
    collMod: "books",
    validator: {
        $jsonSchema :{
            bsonType: "object",
            required: [ "book_id", "title", "author", "price", "category_id"],
            properties: {
                book_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                title: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                author: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                category_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});

// Insertamos documentos validos
use("shop");
db.books.insertMany([
    {
        "book_id": 1,
        "title": "Learning MySQL",
        "author": "Jesper Wisborg Krogh",
        "price": 34.31,
        "category_id": 1
    },
    {
        "book_id": 2,
        "title": "JavaScript Next",
        "author": "Raju Gandhi",
        "price": 36.70,
        "category_id": 1
    },
    {
        "book_id": 3,
        "title": "The Complete Robot",
        "author": "Isaac Asimov",
        "price": 12.13,
        "category_id": 2
    },
    {
        "book_id": 4,
        "title": "Foundation and Earth",
        "author": "Isaac Asimov",
        "price": 11.07,
        "category_id": 2
    },
    {
        "book_id": 5,
        "title": "The Da Vinci Code",
        "author": "Dan Brown",
        "price": 7.99,
        "category_id": 3
    },
    {
        "book_id": 6,
        "title": "A Column of Fire",
        "author": "Ken Follett",
        "price": 6.99,
        "category_id": 3
    }
]);
// corroboramos que se insertaron los documentos
use("shop");
db.books.find();

// Para orders
use("shop");
db.orders.runCommand({
    collMod: "orders",
    validator: {
        $jsonSchema :{
            bsonType: "object",
            required: [ "order_id", "delivery_name", "delivery_address", "cc_name", "cc_number", "cc_expiry"],
            properties: {
                order_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                delivery_name: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                delivery_address: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                cc_name: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                cc_number: {
                    bsonType: "string",
                    maxLength: 32,
                    description: "must be a string and is required"
                },
                cc_expiry: {
                    bsonType: "string",
                    maxLength: 20,
                    description: "must be a string and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});

// insertamos documentos validos
use("shop");
db.orders.insertMany([
    {
        "order_id": 1,
        "delivery_name": "John Doe",
        "delivery_address": "123 Main Street",
        "cc_name": "John Doe",
        "cc_number": "1111-2222-3333-4444",
        "cc_expiry": "01/22"
    },
    {
        "order_id": 2,
        "delivery_name": "Jane Smith",
        "delivery_address": "456 Main Street",
        "cc_name": "Jane Smith",
        "cc_number": "5555-6666-7777-8888",
        "cc_expiry": "02/23"
    }
]);
// corroboramos que se insertaron los documentos
use("shop");
db.orders.find();

// Para order_details
use("shop");
db.order_details.runCommand({
    collMod: "order_details",
    validator: {
        $jsonSchema :{
            bsonType: "object",
            required: [ "id", "book_id", "title", "author", "quantity", "price", "order_id"],
            properties: {
                id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                book_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                title: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                author: {
                    bsonType: "string",
                    maxLength: 70,
                    description: "must be a string and is required"
                },
                quantity: {
                    bsonType: "int",
                    description: "must be a int and is required"
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                order_id: {
                    bsonType: "int",
                    description: "must be a int and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
});

// insertamos documentos validos
use("shop");
db.order_details.insertMany([
    {
        "id": 1,
        "book_id": 1,
        "title": "Learning MySQL",
        "author": "Jesper Wisborg Krogh",
        "quantity": 1,
        "price": 34.31,
        "order_id": 1
    },
    {
        "id": 2,
        "book_id": 2,
        "title": "JavaScript Next",
        "author": "Raju Gandhi",
        "quantity": 1,
        "price": 36.70,
        "order_id": 1
    },
    {
        "id": 3,
        "book_id": 3,
        "title": "The Complete Robot",
        "author": "Isaac Asimov",
        "quantity": 1,
        "price": 12.13,
        "order_id": 2
    },
    {
        "id": 4,
        "book_id": 4,
        "title": "Foundation and Earth",
        "author": "Isaac Asimov",
        "quantity": 1,
        "price": 11.07,
        "order_id": 2
    },
    {
        "id": 5,
        "book_id": 5,
        "title": "The Da Vinci Code",
        "author": "Dan Brown",
        "quantity": 1,
        "price": 7.99,
        "order_id": 2
    },
    {
        "id": 6,
        "book_id": 6,
        "title": "A Column of Fire",
        "author": "Ken Follett",
        "quantity": 1,
        "price": 6.99,
        "order_id": 2
    }
]);
// corroboramos que se insertaron los documentos
use("shop");
db.order_details.find();

// Ahora que tenemos el modelo de datos, aplicando las estrategias “Modelo de datos anidados” y Referencias,
// y que insertamos algunos documentos para las colecciones del modelo de datos,
// podemos responder las queries de manera eficiente.
// Queries
// I. Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
use("shop");
db.books.find({author: "Isaac Asimov"}, {book_id:1, title:1, price:1, category_id:1});
// II. Cantidad de libros por categorías
use("shop");
db.books.aggregate([
    {
        $group: {
            _id: "$category_id",
            count: {$sum: 1}
        }
    }
]);
// III. Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado.
use("shop");
db.orders.aggregate([
    {
        $lookup: {
            from: "order_details",
            localField: "order_id",
            foreignField: "order_id",
            as: "order_details"
        }
    },
    {
        $match: {
            order_id: 2
        }
    },
    {
        $project: {
            _id: 0,
            delivery_name: 1,
            delivery_address: 1,
            total: {
                $sum: {
                    $multiply: ["$order_details.quantity", "$order_details.price"]
                }
            }
        }
    }
]);
// Me sale este error
//PlanExecutor error during aggregation :: caused by :: $multiply only supports numeric types, not array
// pero no se como solucionarlo
// RESPUESTA:
// El error se debe a que el campo "quantity" es un array y no un numero.
// Para solucionarlo, primero descomponemos el array en sus elementos.
// Luego multiplicamos cada elemento del array por el campo "price".
// Por ultimo sumamos todos los elementos del array.
use("shop");
db.orders.aggregate([
    {
        $lookup: {
            from: "order_details",
            localField: "order_id",
            foreignField: "order_id",
            as: "order_details"
        }
    },
    {
        $match: {
            order_id: 2
        }
    },
    {
        $project: {
            _id: 0,
            delivery_name: 1,
            delivery_address: 1,
            total: {
                $sum: {
                    $map: {
                        input: "$order_details",
                        as: "order_detail",
                        in: {
                            $multiply: ["$$order_detail.quantity", "$$order_detail.price"]
                        }
                    }
                }
            }
        }
    }
]);


use("supplies");
db.runCommand( { 
    collMod: "sales",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "saleDate",
                "storeLocation",
                "purchaseMethod",
                "customer"
            ],
            properties: {
                saleDate: {
                    bsonType: "date"
                },
                storeLocation: {
                    bsonType: "string"
                },
                purchaseMethod: {
                    bsonType: "string"
                },
                customer: {
                    bsonType: "object",
                    required: [
                        "email",
                        "age",
                        "satisfaction"
                    ],
                    properties: {
                        email: {
                            bsonType: "string"
                        },
                        age: {
                            bsonType: "int"
                        },
                        satisfaction: {
                            bsonType: "int"
                        }
                    }
                }
            }
        }
    }
} );
