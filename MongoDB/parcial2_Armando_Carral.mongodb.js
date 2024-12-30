// 1. Buscar las ventas realizadas en "London", "Austin" o "San Diego"; 
// a un customer con edad mayor-igual a 18 años que tengan productos que hayan 
// salido al menos 1000 y estén etiquetados (tags) como de tipo "school" o 
// "kids" (pueden tener más etiquetas).
// Mostrar el id de la venta con el nombre "sale", la fecha (“saleDate"), 
// el storeLocation, y el "email del cliente. No mostrar resultados anidados. 

use("supplies");
db.sales.find();

use("supplies");
db.storeObjectives.find();

use("supplies");
db.sales.aggregate([
    { $match: { 
        $and: [
            { storeLocation: { $in: ["London", "Austin", "San Diego"] } },
            { "customer.age": { $gte: 18 } },
            { "items.price": { $gte: 1000 } },
            { "items.tags": { $in: ["school", "kids"] } }
        ] } 
    },
    { $project: { 
        _id: 1,
        saleDate: 1, 
        storeLocation: 1, 
        "customer.email": 1 
    } }
]);


// ================================================================
// 2. Buscar las ventas de las tiendas localizadas en Seattle, donde el método de compra sea ‘In store’ o ‘Phone’ 
// y se hayan realizado entre 1 de febrero de 2014 y 31 de enero de 2015 (ambas fechas inclusive). 
// Listar el email y la satisfacción del cliente, y el monto total facturado, donde el monto de cada item 
// se calcula como 'price * quantity'. 
// Mostrar el resultado ordenados por satisfacción (descendente), frente a empate de satisfacción ordenar 
// por email (alfabético). 

use("supplies");
db.sales.find();

use("supplies");
db.storeObjectives.find();

use("supplies");
db.sales.aggregate([
    // Descomponemos el arreglo de items
    { $unwind: "$items"},
    // Filtramos por storeLocation, purchaseMethod y saleDate
    { $match: {
        $and: [
            { storeLocation: "Seattle" },
            { purchaseMethod: { $in: ["In store", "Phone"] } },
            { saleDate: { $gte: ISODate("2014-02-01"), $lte: ISODate("2015-01-31") } }
        ]
    }},
    // Agrupamos por email y satisfaction
    { $project: {
        _id: 0,
        email: "$customer.email",
        satisfaction: "$customer.satisfaction",
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    // Ordenamos por satisfaction y email
    { $sort: {
        satisfaction: -1,
        email: 1
    }}
]);

// ================================================================
// 3.Crear la vista salesInvoiced que calcula el monto mínimo, monto máximo, monto total y 
// monto promedio facturado por año y mes. Mostrar el resultado en orden cronológico. 
// No se debe mostrar campos anidados en el resultado
use("supplies");
db.sales.find();

use("supplies");
db.storeObjectives.find();

use("supplies");
db.sales.aggregate([
    // Descomponemos el arreglo de items
    { $unwind: "$items" },
    // Agrupamos por año y mes
    { $group: {
        _id: { 
            year: { $year: "$saleDate" }, 
            month: { $month: "$saleDate" } 
        },
        min: { $min: { $multiply: ["$items.price", "$items.quantity"] } },
        max: { $max: { $multiply: ["$items.price", "$items.quantity"] } },
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        avg: { $avg: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    // Mostramos los campos requeridos
    { $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        min: 1,
        max: 1,
        total: 1,
        avg: 1
    }},
    // Ordenamos por año y mesuse("supplies");
    { $sort: { year: 1, month: 1 }}
]);

// consultamos la vista
use("supplies");
db.salesInvoiced.find();

// ================================================================
// 4. Mostrar el storeLocation, la venta promedio de ese local, el objetivo a cumplir de ventas 
// (dentro de la colección storeObjectives) y la diferencia entre el promedio y el objetivo de 
// todos los locales.

use("supplies");
db.sales.find();

use("supplies");
db.storeObjectives.find();

use("supplies");
db.sales.aggregate([
    // Descomponemos el arreglo de items
    { $unwind: "$items" },
    // Agrupamos por storeLocation
    { $group: {
        _id: "$storeLocation",
        avg: { $avg: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    // Unimos con la colección storeObjectives
    { $lookup: {
        from: "storeObjectives",
        localField: "_id",
        foreignField: "_id",
        as: "objective"
    }},
    // Descomponemos el arreglo de objective
    { $unwind: "$objective" },
    // Mostramos los campos requeridos
    { $project: {
        _id: 0,
        storeLocation: "$_id",
        avg: 1,
        objective: "$objective.objective",
        diff: { $subtract: ["$objective.objective", "$avg"] }
    }}
]);

// ================================================================
// 5. Especificar reglas de validación en la colección sales utilizando JSON Schema. 
// a. Las reglas se deben aplicar sobre los campos: saleDate, storeLocation, purchaseMethod, 
// y  customer ( y todos sus campos anidados ). Inferir los tipos y otras restricciones que 
// considere adecuados para especificar las reglas a partir de los documentos de la colección. 
// b. Para testear las reglas de validación crear un caso de falla en la regla de validación y 
// un caso de éxito (Indicar si es caso de falla o éxito)
use("supplies");
db.sales.find();

use("supplies");
db.storeObjectives.find();

// Parte a
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
                    bsonType: "string",
                    maxLength: 30,
                    description: "must be a string and is required and max 30 characters"

                },
                purchaseMethod: {
                    bsonType: "string",
                    maxLength: 10,
                    description: "must be a string and is required and max 10 characters"
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
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        age: {
                            bsonType: "int",
                            description: "must be a int and is required"
                        },
                        satisfaction: {
                            bsonType: "int",
                            description: "must be a int and is required"

                        }
                    }
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "error"
} );

// Parte b
// Testeamos la regla de validación con un documento que no cumple con la misma
use("supplies");
db.sales.insertOne({
    saleDate: ISODate("2019-10-27T19:30:00Z"),
    storeLocation: "Seattle",
    purchaseMethod: "In store",
    customer: {
        age: 18,
        satisfaction: 5
    },
    items: [
        {
            name: "item1",
            price: 1000,
            quantity: 1,
            tags: ["school"]
        }
    ]
});

// Testeamos la regla de validación con un documento que cumple con la misma
use("supplies");
db.sales.insertOne({
    saleDate: ISODate("2019-10-27T19:30:00Z"),
    storeLocation: "Seattle",
    purchaseMethod: "In store",
    customer: {
        email: "hacker yu@fakegmail.com",
        age: 18,
        satisfaction: 5
    },
    items: [
        {
            name: "item2",
            price: 1000,
            quantity: 1,
            tags: ["school"]
        }
    ]   
});
