
[Issues]
    courier/sender field in the schema




[postgres setup sequence]
*creating a role and a database owned by it
    sudo -i -u postgres

    createuser -P nodetest

    su pete

    createdb -O nodetest nodetest

    in pg_hba.conf
    local       all        all     md5


*psql & SQL commands

    "select * from pg_database"-gives you all database info
    \? ->  can tell you your current database

    \i -> execute from a file

BIGSWIGMONEY



