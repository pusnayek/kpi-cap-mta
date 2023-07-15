using POPULATIONS from '../db/kpi-views';

@requires: 'authenticated-user'
service KpiService {

    entity Populations as projection on POPULATIONS;
}