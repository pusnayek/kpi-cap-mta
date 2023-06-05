using { ET as ET } from '../db/structures/ET';
using { CT as CT } from '../db/structures/CT';
using { FT as FT } from '../db/structures/FT';
using { ST as ST } from '../db/structures/ST';
using { XT as XT } from '../db/structures/XT';

@path: 'service/data'
@requires: 'authenticated-user'
service DataService {
    @readonly
    entity Employees as projection on ET.Employee;

    @readonly
    entity Items as projection on ET.Item;

    @readonly
    entity Assignments as projection on ET.Assignment;

    @readonly
    entity RecentAssignments as projection on ET.RecentAssignment;

    @readonly
    entity Completions as projection on ET.Completion;

    @readonly
    entity RecentCompletions as projection on ET.RecentCompletion;

    @readonly
    entity Admins as projection on ET.AdminAccess;

    @readonly
    @requires: 'CommunicatonUserAccess'
    entity ExtractionStatuses as projection on CT.ExtractionStatus;

    function getGreeting() returns String;
    
    function uploadAdmins() returns String;

}