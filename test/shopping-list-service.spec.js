const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List Service Object`, function() {
    let db
    let testShoppingList = [
        {
            id: 1,
            name: 'Fish tricks',
            price: '13.10',
            date_added: new Date('2019-07-14T03:24:22.000Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 2,
            name: 'Not Dogs',
            price: '4.99',
            date_added: new Date('2019-07-14T03:24:22.000Z'),
            checked: true,
            category: 'Snack'
        },
        {
            id: 3,
            name: 'Bluffalo Wings',
            price: '5.50',
            date_added: new Date('2019-07-14T03:24:22.000Z'),
            checked: false,
            category: 'Snack'
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => {
        return db('shopping_list').truncate()
    })

    afterEach(() => db('shopping_list').truncate())

    after(() => { db.destroy()})

    context(`Given 'shopping_list' has data`, () => {
    
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })

        it(`getAllArticles() resolves all articles from 'shopping_list' table`, () => {
            // test that ShoppingListService.getAllArticles gets data from table
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList)
                })
            })

        it(`getbyId() resolves an article by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testShoppingList[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category,
                    })
                })
        })

        it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testShoppingList.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateArticle() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: '12.34',
                date_added: new Date(),
                checked: true,
                category: 'Snack'
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {

        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name', 
                price: '123.45',
                date_added: new Date(),
                checked: true,
                category: 'Snack',
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    })
                })
        })
    
    })
})