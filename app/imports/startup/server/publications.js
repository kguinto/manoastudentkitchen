import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';

Interests.publish();
Profiles.publish();
Tags.publish();

