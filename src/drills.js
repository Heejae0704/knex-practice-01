require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

function getItemsWithText(searchTerm) {
    knexInstance
        .select('id', 'name', 'price')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// getItemsWithText('fish')

function getAllItemsPaginated(pageNumber) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);
    knexInstance
        .select('id', 'name', 'price')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

// getAllItemsPaginated(2)

function getItemsAddedAfter(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'date_added', knexInstance.raw('now() - date_added as days_passed'))
        .from('shopping_list')
        .where(
            knexInstance.raw('now() - date_added'),
            '>',
            knexInstance.raw(`'?? days'::interval`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

// getItemsAddedAfter(5);

function getTotalCostforEachCategory() {
    knexInstance
        .select('category')
        .sum('price as sum')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

getTotalCostforEachCategory();