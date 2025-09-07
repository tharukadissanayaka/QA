Feature: Add a new selling book
  As an admin
  I want to add a new book
  So that it appears in the selling books list

  Scenario: Add a new book successfully
    Given I am on the admin page
    When I fill the add book form with valid data
    And I submit the book
  


