import { PasswordsDoNotMatchFilter } from "./passwords-do-not-match.filter";
import { UserAlreadyExistsFilter } from "./user-already-exists.filter";

export const globalFilters = [UserAlreadyExistsFilter, PasswordsDoNotMatchFilter];
