-- Users and roles
CREATE TABLE users (
                            id BIGSERIAL PRIMARY KEY,
                            email VARCHAR(160) NOT NULL UNIQUE,
                            password_hash VARCHAR(100) NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);

CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            user_id BIGINT,
                            name VARCHAR(100) NOT NULL UNIQUE,
                            description VARCHAR(500),
                            color VARCHAR(20),
                            active BOOLEAN NOT NULL DEFAULT TRUE,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_categories_user ON categories(user_id);

CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          user_id BIGINT,
                          category_id BIGINT NOT NULL,
                          name VARCHAR(150) NOT NULL,
                          code VARCHAR(50) NOT NULL UNIQUE,
                          price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                          stock_quantity INTEGER NOT NULL DEFAULT 0,
                          minimum_stock INTEGER NOT NULL DEFAULT 0,
                          description VARCHAR(1000),
                          active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_products_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(id),

                          CONSTRAINT fk_products_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(id),

                          CONSTRAINT chk_products_price
                              CHECK (price >= 0),

                          CONSTRAINT chk_products_stock_quantity
                              CHECK (stock_quantity >= 0),

                          CONSTRAINT chk_products_minimum_stock
                              CHECK (minimum_stock >= 0)
);

CREATE INDEX idx_products_user ON products(user_id);

CREATE TABLE stock_movements (
                                 id BIGSERIAL PRIMARY KEY,
                                 user_id BIGINT,
                                 product_id BIGINT NOT NULL,
                                 movement_type VARCHAR(20) NOT NULL,
                                 quantity INTEGER NOT NULL,
                                 destination VARCHAR(150),
                                 reason VARCHAR(500),
                                 movement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_stock_movements_product
                                     FOREIGN KEY (product_id)
                                         REFERENCES products(id),

                                 CONSTRAINT fk_stock_movements_user
                                     FOREIGN KEY (user_id)
                                         REFERENCES users(id),

                                 CONSTRAINT chk_stock_movements_type
                                     CHECK (movement_type IN ('ENTRY', 'EXIT')),

                                 CONSTRAINT chk_stock_movements_quantity
                                     CHECK (quantity > 0)
);

CREATE INDEX idx_stock_movements_user ON stock_movements(user_id);

CREATE TABLE financial_categories (
                                      id BIGSERIAL PRIMARY KEY,
                                      user_id BIGINT,
                                      name VARCHAR(100) NOT NULL UNIQUE,
                                      description VARCHAR(500),
                                      active BOOLEAN NOT NULL DEFAULT TRUE,
                                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      CONSTRAINT fk_financial_categories_user
                                          FOREIGN KEY (user_id)
                                              REFERENCES users(id)
);

CREATE INDEX idx_financial_categories_user ON financial_categories(user_id);

CREATE TABLE cost_centers (
                              id BIGSERIAL PRIMARY KEY,
                              user_id BIGINT,
                              name VARCHAR(100) NOT NULL UNIQUE,
                              description VARCHAR(500),
                              active BOOLEAN NOT NULL DEFAULT TRUE,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_cost_centers_user
                                  FOREIGN KEY (user_id)
                                      REFERENCES users(id)
);

CREATE INDEX idx_cost_centers_user ON cost_centers(user_id);

CREATE TABLE financial_transactions (
                                        id BIGSERIAL PRIMARY KEY,
                                        user_id BIGINT,
                                        financial_category_id BIGINT NOT NULL,
                                        cost_center_id BIGINT,
                                        stock_movement_id BIGINT,
                                        transaction_type VARCHAR(20) NOT NULL,
                                        description VARCHAR(500),
                                        amount NUMERIC(12, 2) NOT NULL,
                                        transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
                                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                        CONSTRAINT fk_financial_transactions_category
                                            FOREIGN KEY (financial_category_id)
                                                REFERENCES financial_categories(id),

                                        CONSTRAINT fk_financial_transactions_cost_center
                                            FOREIGN KEY (cost_center_id)
                                                REFERENCES cost_centers(id),

                                        CONSTRAINT fk_financial_transactions_stock_movement
                                            FOREIGN KEY (stock_movement_id)
                                                REFERENCES stock_movements(id),

                                        CONSTRAINT fk_financial_transactions_user
                                            FOREIGN KEY (user_id)
                                                REFERENCES users(id),

                                        CONSTRAINT chk_financial_transactions_type
                                            CHECK (transaction_type IN ('INCOME', 'EXPENSE')),

                                        CONSTRAINT chk_financial_transactions_amount
                                            CHECK (amount > 0)
);

CREATE INDEX idx_financial_transactions_user ON financial_transactions(user_id);