import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Locations } from '/imports/api/location/LocationCollection';

Interests.publish();
Profiles.publish();
Recipes.publish();
Locations.publish();
Tags.publish();

