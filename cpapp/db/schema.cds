namespace sap.ui.riskmanagement;
using { managed, cuid } from '@sap/cds/common';

  entity Risks : managed {
    key ID      : UUID  @(Core.Computed : true);
    title       : String(100);
    prio        : String(5);
    descr       : String;
    miti        : Association to Mitigations;
    impact      : Integer;
    criticality : Integer;
  }

  entity Mitigations : managed {
    key ID       : UUID  @(Core.Computed : true);
    description  : String;
    owner        : String;
    timeline     : String;
    risks        : Association to many Risks on risks.miti = $self;
  }

  entity Products : managed, cuid 
  {
    description  : String;
    quantity     : Decimal(11,2); //Decimal(Precision,Scale) = Precision=Total digits including decimal places and integer part.
    price        : Decimal(11,2)
  }
