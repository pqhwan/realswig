
[Directives]
    facebook signup
    coupon system

[Issues]
    security: security measure for hash values used for creating confirmation/referral links
        -currently an MD5 hash of user email&zipcode concatenated

[referral system]
DEV
    db: schema update
        #create table for referrals

    referrer: create and distribute "special links"
        #user shares url "swiggly.org?referrer={{hash}}"
        #include it in the confirmation email

    referred: the referred clicks on it
        #/register route now checks for a referrer query string value
        #add newcomer to emails table
        #query db for referrer with hash value
        #if referrer is genuine, insert into referrals values(referrer, referred,
        #!!!make sure referrer and referred are different
        !!!make sure users already signed up cannot get referred

DEPLOY
    -run schema.sql


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


