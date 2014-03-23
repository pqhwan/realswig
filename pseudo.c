
[Directives]
    facebook signup

[Issues]
    security: security measure for hash values used for creating confirmation/referral links
        -currently an MD5 hash of user email&zipcode concatenated

[referral system]
    1:create and distribute "special links"
        -design the referral url "swiggly.org/refer?referrer={{userhash}}"
            "swiggly.org?referrer={{hash}}"
        -include it in the confirmtion email

    2:take care of what happens when someone clicks on it
        -make route for the referral url 
        -link them to 
        -add newcomer to emails table
        -query db for original referrer
        -if referrer exists, insert into referrals values()

    1:create and distribute "special links"
        -user shares url "swiggly.org?referrer={{hash}}"
        -include it in the confirmation email

    2:the referred clicks on it
        -register route now checks for a referrer query string value
        -add newcomer to emails table
        -query db for referrer with hash value
        -if referrer is genuine, insert into referrals values(referrer, referred,

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


