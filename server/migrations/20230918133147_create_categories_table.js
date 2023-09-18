/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const tableExists = await knex.schema.hasTable('categories');
    if (!tableExists) {
        return knex.schema.createTable('categories', (table) => {
            table.increments('CategoryID').primary();
            table.integer('UserID').unsigned();
            table.string('CategoryName');
            table.foreign('UserID').references('users.UserID');
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('categories');
};
