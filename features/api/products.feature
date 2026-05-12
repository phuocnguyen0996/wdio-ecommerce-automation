Feature: E-commerce Products API Validation
  # API target: https://dummyjson.com — public e-commerce REST API
  # Demonstrates: CRUD operations, error handling, authentication, data validation

  @api @smoke
  Scenario: Get all products returns successful response with data
    When I send a GET request to "/products"
    Then the API response status should be 200
    And the response should contain a non-empty products list

  @api
  Scenario: Get products with limit parameter returns correct count
    When I send a GET request to "/products?limit=5&skip=0"
    Then the API response status should be 200
    And the products list should contain exactly 5 items

  @api @smoke
  Scenario: Get single product by valid ID returns full product details
    When I send a GET request to "/products/1"
    Then the API response status should be 200
    And the product should have required fields "id,title,price,category,thumbnail,stock"

  @api @negative
  Scenario: Get product with non-existent ID returns not found error
    When I send a GET request to "/products/99999"
    Then the API response status should be 404
    And the response body should contain field "message"

  @api
  Scenario: Get all product categories returns a non-empty list
    When I send a GET request to "/products/categories"
    Then the API response status should be 200
    And the response should be a non-empty array

  @api
  Scenario: Get products filtered by category returns only matching products
    When I send a GET request to "/products/category/smartphones"
    Then the API response status should be 200
    And all products in the list should have category "smartphones"

  @api
  Scenario: Create a new product via POST returns created product
    When I send a POST request to "/products/add" with body:
      """
      {"title":"Interview Demo Product","price":49.99,"stock":100,"category":"electronics","description":"QA Demo Product for portfolio"}
      """
    Then the API response status should be 201
    And the response body should contain field "id"
    And the response field "title" should equal "Interview Demo Product"

  @api
  Scenario: Update an existing product via PUT returns updated data
    When I send a PUT request to "/products/1" with body:
      """
      {"title":"Updated Sauce Labs Backpack","price":35.99}
      """
    Then the API response status should be 200
    And the response field "title" should equal "Updated Sauce Labs Backpack"

  @api
  Scenario: Delete a product via DELETE confirms deletion
    When I send a DELETE request to "/products/1"
    Then the API response status should be 200
    And the response body should contain field "isDeleted"
    And the response field "isDeleted" should be true

  @api @smoke
  Scenario: Authenticate user with valid credentials returns access token
    When I send a POST request to "/auth/login" with body:
      """
      {"username":"emilys","password":"emilyspass","expiresInMins":30}
      """
    Then the API response status should be 200
    And the response body should contain field "accessToken"
