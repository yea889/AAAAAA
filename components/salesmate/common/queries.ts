export default {
  listCompanies: {
    "displayingFields": [
      "company.createdAt",
      "company.type",
      "company.phone",
      "company.billingAddressLine1",
      "company.textCustomField3",
      "company.tags",
      "company.annualRevenue",
      "company.billingCity",
      "company.owner.name",
      "company.owner.photo",
      "company.owner.id",
      "company.name",
      "company.billingState",
      "company.billingCountry",
      "company.totalAmountOfOpenDeal",
      "company.lastCommunicationAt",
      "company.lastCommunicationMode",
      "company.openActivities",
      "company.totalAmountOfWonDeal",
      "company.textCustomField8",
      "company.wonDealCount",
      "company.lostDealCount",
      "company.openDealCount",
      "company.photo",
      "company.id",
    ],
    "filterQuery": {
      "group": {
        "rules": [
          {
            "condition": "IS_AFTER",
            "moduleName": "Company",
            "field": {
              "fieldName": "company.createdAt",
              "displayName": "Created At",
              "type": "DateTime",
            },
            "data": "Jan 01, 1970 05:30 AM",
            "eventType": "DateTime",
          },
        ],
      },
    },
    "sort": {
      "fieldName": "company.name",
      "order": "asc",
    },
  },
  listContacts: {
    "displayingFields": [
      "contact.company.name",
      "contact.company.id",
      "contact.company.photo",
      "contact.designation",
      "contact.type",
      "contact.email",
      "contact.mobile",
      "contact.billingCity",
      "contact.billingCountry",
      "contact.tags",
      "contact.name",
      "contact.lastNoteAddedBy.name",
      "contact.lastNoteAddedBy.photo",
      "contact.lastNoteAddedBy.id",
      "contact.lastNoteAddedAt",
      "contact.lastNote",
      "contact.lastCommunicationMode",
      "contact.lastCommunicationBy",
      "contact.lastCommunicationAt",
      "contact.lastModifiedBy.name",
      "contact.lastModifiedBy.photo",
      "contact.lastModifiedBy.id",
      "contact.createdBy.name",
      "contact.createdBy.photo",
      "contact.createdBy.id",
      "contact.lastModifiedAt",
      "contact.openDealCount",
      "contact.utmSource",
      "contact.utmCampaign",
      "contact.utmTerm",
      "contact.utmMedium",
      "contact.utmContent",
      "contact.library",
      "contact.emailMessageCount",
      "contact.description",
      "contact.photo",
      "contact.emailOptOut",
      "contact.firstName",
      "contact.lastName",
      "contact.id",
      "contact.createdAt",
    ],
    "filterQuery": {
      "group": {
        "rules": [
          {
            "condition": "IS_AFTER",
            "moduleName": "Contact",
            "field": {
              "fieldName": "contact.createdAt",
              "displayName": "Created At",
              "type": "DateTime",
            },
            "data": "Jan 01, 1970 05:30 AM",
            "eventType": "DateTime",
          },
        ],
      },
    },
    "sort": {
      "fieldName": "contact.createdAt",
      "order": "desc",
    },
  },
  listDeals: {
    "displayingFields": [
      "deal.id",
      "deal.title",
      "deal.primaryContact.totalActivities",
      "deal.primaryContact.id",
      "deal.primaryContact.photo",
      "deal.primaryContact.closedActivities",
      "deal.primaryContact.openActivities",
      "deal.lastModifiedAt",
      "deal.pipeline",
      "deal.stage",
      "deal.owner.name",
      "deal.owner.photo",
      "deal.owner.id",
      "deal.lastCommunicationBy",
      "deal.source",
      "deal.dealValue",
      "deal.status",
      "deal.estimatedCloseDate",
      "deal.lastNote",
      "deal.lastActivityAt",
      "deal.primaryCompany.name",
      "deal.primaryCompany.id",
      "deal.primaryCompany.photo",
      "deal.lostReason",
      "deal.currency",
      "deal.priority",
      "deal.tags",
      "deal.description",
      "deal.closedDate",
      "deal.primaryContact.name",
      "deal.lastCommunicationAt",
      "deal.primaryContact.firstName",
      "deal.primaryContact.lastName",
    ],
    "filterQuery": {
      "group": {
        "operator": "AND",
        "rules": [
          {
            "condition": "IS_AFTER",
            "moduleName": "Deal",
            "field": {
              "fieldName": "deal.createdAt",
              "displayName": "Created At",
              "type": "DateTime",
            },
            "data": "Jan 01, 1970 05:30 AM",
            "eventType": "DateTime",
          },
        ],
      },
    },
    "sort": {
      "fieldName": "deal.createdAt",
      "order": "desc",
    },
    "moduleId": 4,
  },
  listStages: (group) => ({
    "query": {
      "group": {
        "operator": "AND",
        "rules": [
          {
            "condition": "EQUALS",
            "data": {
              "group": group,
              "value": "",
            },
            "field": {
              "fieldName": "deal.pipeline",
              "displayName": "Pipeline",
              "type": "Select",
            },
          },
          {
            "group": {
              "operator": "AND",
              "rules": [
                {
                  "condition": "EQUALS",
                  "data": "$MYSELF$",
                  "field": {
                    "fieldName": "deal.owner",
                  },
                  "moduleName": "Deal",
                },
                {
                  "condition": "EQUALS",
                  "data": "Open",
                  "field": {
                    "fieldName": "deal.status",
                  },
                  "moduleName": "Deal",
                },
              ],
            },
          },
        ],
      },
    },
  }),
};
