using POPULATIONS from '../db/kpi-views';
using FILTERS from '../db/kpi-views';
using COMPETENCYSTATUS from '../db/kpi-views';
using COMPETENCYGAPS from '../db/kpi-views';
using EMPLOYEECOMPETENCY from '../db/kpi-views';
using BYCOMPETENCIES from '../db/kpi-views';
using BYMANAGERS from '../db/kpi-views';

@requires: 'authenticated-user'
service KpiService {

    entity Populations as projection on POPULATIONS;

    entity Filters as projection on FILTERS;

    entity CompetencyStatuses as projection on COMPETENCYSTATUS;

    entity CompetencyGaps as projection on COMPETENCYGAPS;

    entity EmployeeCompetencies as projection on EMPLOYEECOMPETENCY;

    entity ByCompetencies as projection on BYCOMPETENCIES;

    entity ByManagers as projection on BYMANAGERS;

}