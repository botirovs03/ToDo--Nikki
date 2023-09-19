/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const tableExists = await knex.schema.hasTable('users');
    if (!tableExists) {
      return knex.schema.createTable('users', (table) => {
        table.increments('UserID').primary();
        table.string('Username');
        table.string('Email').unique();
        table.string('Password');
      });
    }
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
  };
  