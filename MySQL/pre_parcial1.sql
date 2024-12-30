/* 1. Devuelva la oficina con mayor número de empleados. */
USE classicmodels;
SELECT officeCode, COUNT(employeeNumber) AS Cantidad_Empleados
FROM employees
GROUP BY officeCode
ORDER BY Cantidad_Empleados DESC 
LIMIT 1;

/* 2. ¿Cuál es el promedio de órdenes hechas por oficina?, 
      ¿Qué oficina vendió la mayor cantidad de productos? */
USE classicmodels;
SELECT * FROM orderdetails;
-- Primero calculamos el promedio de ordenes por oficina
USE classicmodels;
SELECT officeCode, COUNT(orderNumber) AS Cantidad_Ordenes
FROM orders
LEFT JOIN employees ON orders.employeeNumber = employees.employeeNumber



/* 3. Devolver el valor promedio, máximo y mínimo de pagos que se hacen por mes. */
USE classicmodels;
SELECT * FROM payments;
--Calculamos
USE classicmodels;
SELECT MONTH(paymentDate) AS Mes, AVG(amount) AS Promedio, MAX(amount) AS Maximo, MIN(amount) AS Minimo
FROM payments
GROUP BY Mes;

/* 4. Crear un procedimiento "Update Credit" en donde se modifique el límite de crédito de
un cliente con un valor pasado por parámetro. */

create procedure UpdateCredit (in customerNumber int, in newCreditLimit int)
begin 
    update customers
    set creditLimit = newCreditLimit
    where customerNumber = customerNumber;
end
--Hacemos una prueba
use classicmodels;  -- actualizamos el credito del cliente 103 de 21000 a 100000
call UpdateCredit(103, 100000);
use classicmodels;  -- verificamos la actualizacion
select * from customers where customerNumber = 103;

/* 5. Cree una vista "Premium Customers" que devuelva el top 10 de clientes que más
dinero han gastado en la plataforma. La vista deberá devolver el nombre del cliente,
la ciudad y el total gastado por ese cliente en la plataforma. */

use classicmodels;
create view Premium_Customers as
    select customers.customerName, customers.city, sum(payments.amount) as Total_Gastado
    from customers
    left join payments on customers.customerNumber = payments.customerNumber
    group by customers.customerName, customers.city
    order by Total_Gastado desc
    limit 10;

-- Vemos la vista
use classicmodels;
select * from Premium_Customers;

/* 6. Cree una función "employee of the month" que tome un mes y un año y devuelve el
empleado (nombre y apellido) cuyos clientes hayan efectuado la mayor cantidad de
órdenes en ese mes. */
use classicmodels;
select * from employees;
use classicmodels;
create function employee_of_the_month (month int, year int) returns varchar(50) DETERMINISTIC
begin
    declare employeeName varchar(50);
    select concat(firstName, ' ', lastName) into employeeName
    from employees
    where employeeNumber = (
        select employeeNumber
        from orders
        where MONTH(orderDate) = month AND YEAR(orderDate) = year
        group by employeeNumber
        order by count(orderNumber) desc, employeeNumber asc
        limit 1
    );
    return employeeName;
end
-- Hacemos una prueba
use classicmodels;
select employee_of_the_month(1, 2003);

USE classicmodels;
-- Llamada a la función para obtener el empleado del mes para el mes 1 y el año 2005
SELECT employee_of_the_month(4, 2003) AS EmployeeOfTheMonth;


/* 7. Crear una nueva tabla "Product Refillment". Deberá tener una relación varios a uno
con "products" y los campos: `refillmentID`, `productCode`, `orderDate`, `quantity`. */
use classicmodels;
create table Product_Refillment (
    refillmentID int not null auto_increment,
    productCode varchar(15) not null,
    orderDate date not null,
    quantity int not null,
    primary key (refillmentID),
    foreign key (productCode) references products(productCode)
);

/* 8. Definir un trigger "Restock Product" que esté pendiente de los cambios efectuados
en `orderdetails` y cada vez que se agregue una nueva orden revise la cantidad de
productos pedidos (`quantityOrdered`) y compare con la cantidad en stock
(`quantityInStock`) y si es menor a 10 genere un pedido en la tabla "Product
Refillment" por 10 nuevos productos. */
use classicmodels;
select * from orderdetails;
-- Definimos el trigger "Restock Product"
use classicmodels;
create trigger Restock_Product after insert
on orderdetails for each row
begin
    declare orderDate date;
    select orderDate into orderDate
    from orders
    where orderNumber = new.orderNumber;
    
    if new.quantityOrdered < 10 then
        insert into Product_Refillment (productCode, orderDate, quantity)
        values (new.productCode, orderDate, 10);
    end if;
end;
-- Hacemos una prueba
use classicmodels;
-- Verificamos si ya existe el registro en orderdetails
select * from orderdetails
where orderNumber = 10100 and productCode = 'S18_1749';

-- Si no existe, insertamos el nuevo registro
insert into orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber)
select * from (
    select 10100, 'S18_1749', 5, 136.00, 3
) as tmp
where not exists (
    select * from orderdetails
    where orderNumber = 10100 and productCode = 'S18_1749'
);
-- Vemos la tabla Product_Refillment
use classicmodels;
select * from Product_Refillment;

/* 9. Crear un rol "Empleado" en la BD que establezca accesos de lectura a todas las
tablas y accesos de creación de vistas. */
