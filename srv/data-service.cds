using { ET as TT } from '../db/structures/TT';
using { ET as ET } from '../db/structures/ET';
using { CT as CT } from '../db/structures/CT';
using { FT as FT } from '../db/structures/FT';
using { ST as ST } from '../db/structures/ST';
using { XT as XT } from '../db/structures/XT';

@path: 'service/data'
@requires: 'authenticated-user'
service DataService {
    @readonly
    entity Employees as projection on TT.Employee;

    @readonly
    entity Items as projection on TT.Item;

    @readonly
    entity Assignments as projection on TT.Assignment;

    @readonly
    entity RecentAssignments as projection on TT.RecentAssignment;

    @readonly
    entity Completions as projection on TT.Completion;

    @readonly
    entity RecentCompletions as projection on TT.RecentCompletion;

    @readonly
    entity Admins as projection on TT.AdminAccess;

    @readonly
    @requires: 'CommunicatonUserAccess'
    entity ExtractionStatuses as projection on CT.ExtractionStatus;

    function getGreeting() returns String;
    
    function uploadAdmins() returns String;

}