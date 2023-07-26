# **User Story:**
_As a home cook,_
_I want to save my favorite recipes and find similar local cuisine,_
_So that I can enhance my cooking experience and have options if things don't go as planned._

---

# **Acceptance Criteria:**

_Given a recipe finder and saver dashboard,_

- **When** I search for a recipe,
    - **Then** I am presented with a list of recipes including dish name, total cooking/prep time, an ingredients list, cooking instructions, and any associated images.

- **When** I select a recipe from the search results,
    - **Then** that recipe is saved to my favorites for easy access in the future.

- **When** I want to view my saved recipes,
    - **Then** I am presented with a list of all my saved recipes, including their details.

- **When** I choose to delete a recipe from my saved list,
    - **Then** that recipe is removed from my saved recipes list.

- **When** I select the option to find similar cuisine nearby for a particular recipe,
    - **Then** I am presented with local restaurants that serve similar dishes, using the Yelp API.

- **When** there is an error in performing an action (such as searching for a recipe),
    - **Then** I am presented with an error message indicating what went wrong.
