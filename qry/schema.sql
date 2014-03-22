create table emails(
    email varchar(90) not null unique,
    zipcode varchar(9) not null,
    role smallint, --0 for none, 1 for courier, 2 sender, 3 both
    boston boolean,
    nyc boolean,
    philly boolean,
    balt boolean,
    dc boolean,
    frequency smallint, --0 for na, 1 for daily, 2 weekly, 3 twice a month, 4 monthly, 5 
                        --twice a year
    confirmed boolean
)
