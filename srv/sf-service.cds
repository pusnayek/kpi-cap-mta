// using an external service from SAP S/4HANA Cloud
using { PLTUserManagement as external } from '../srv/external/PLTUserManagement';

@path: 'service/sf'
service SFService {

    entity Users as projection on external.User {
        key userId,
        defaultLocale,
        ethnicity,
        proxy
    };

    function getUser() returns String;

    function getProxyUser() returns String;

    function updateClockValues() returns String;

}
