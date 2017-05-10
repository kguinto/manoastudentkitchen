import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Locations } from '/imports/api/location/LocationCollection';
import { Ingredients } from '/imports/api/ingredient/IngredientCollection';
import { Images } from '/imports/api/image/ImageCollection';

Interests.publish();
Profiles.publish();
Recipes.publish();
Locations.publish();
Ingredients.publish();
Tags.publish();
Images.publish();
