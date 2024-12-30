-- 1. Devuelva una lista de los nombres y las regiones a las que pertenece cada país ordenada alfabéticamente.
USE world;
SELECT Name, Region FROM country ORDER BY Name;

-- 2. Liste el nombre y la población de las 10 ciudades más pobladas del mundo.
SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10;

-- 3. Liste el nombre, región, superficie y forma de gobierno de los 10 países con menor superficie.
SELECT Name, Region, SurfaceArea, GovernmentForm FROM country ORDER BY SurfaceArea ASC LIMIT 10;

-- 4. Liste todos los países que no tienen independencia (hint: ver que define la independencia de un país en la BD).
SELECT Name, IndepYear FROM country WHERE IndepYear IS NULL;

-- 5. Liste el nombre y el porcentaje de hablantes que tienen todos los idiomas declarados oficiales.
SELECT CountryCode, Percentage FROM countrylanguage WHERE IsOfficial = 'T';