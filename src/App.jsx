/* eslint-disable function-paren-newline */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );

    const user = usersFromServer.find(person => person.id === category.ownerId);

    return {
      ...product,
      category,
      user,
    };
  });

  const toggleCategory = categoryId => {
    setSelectedCategoryId(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  let visibleProducts = [...products];

  if (selectedUserId) {
    visibleProducts = visibleProducts.filter(
      product => product.user.id === selectedUserId,
    );
  }

  if (selectedCategoryId.length > 0) {
    visibleProducts = visibleProducts.filter(product =>
      selectedCategoryId.includes(product.category.id),
    );
  }

  const formatedQuery = query.trim().toLowerCase();

  if (formatedQuery) {
    visibleProducts = visibleProducts.filter(product =>
      product.name.toLowerCase().includes(formatedQuery),
    );
  }

  const handleResetFilters = () => {
    setSelectedUserId(null);
    setSelectedCategoryId([]);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>
            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={selectedUserId === null ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUserId(user.id)}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>
            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>
            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                onClick={() => setSelectedCategoryId(null)}
                className={`button mr-6 is-outlined is-success ${
                  selectedCategoryId === null ? 'is-info' : ''
                }`}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${
                    selectedCategoryId.includes(category.id) ? 'is-info' : ''
                  }`}
                  href="#/"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.icon} {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                onClick={handleResetFilters}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
