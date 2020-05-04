CREATE TABLE app_user (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    user_name     VARCHAR(255)    NOT NULL,
    email         VARCHAR(255)    NOT NULL,
    password_hash VARCHAR(32)   NOT NULL,
    UNIQUE KEY (user_name),
    UNIQUE KEY (email),
    PRIMARY KEY(id)
);

INSERT INTO app_user (user_name, email, password_hash) VALUES ('user', 'user@test.com', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('wcargenven1', 'tgarbert1@quantcast.com', '7166c72d4f0e287d8a43fad1afb1ecc6');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('mdruery2', 'hscopham2@reference.com', '57ac14290b4ca3f7b77456bceb7af930');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('rhandsheart3', 'tbirkmyre3@washington.edu', '7bcdec2ce74e6d3980995960bda22fa9');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('jbrisset4', 'scamolli4@netlog.com', 'f2cdc5df625a106460ecf872fa24184e');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('jleacock5', 'kmcgougan5@opera.com', '3e28be52ea025d22caba3d1cb192f484');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('aprescot6', 'ebottomley6@wisc.edu', '16225ee518147234949b16a82a0160d3');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('kgosby7', 'crajchert7@princeton.edu', '2cf293cb929352047c0a5d82ecaf975c');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('mcroom8', 'jattarge8@pcworld.com', '6b7ddcdf1a61bc6820b0e07437da1bc0');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('cstave9', 'gcallear9@uiuc.edu', '93c9925b276772b6b81c49742d27e2d0');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('chakkinga', 'arableya@cargocollective.com', '08af12d932616e6d892e1501cd17937d');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('rforlongb', 'shyattb@nymag.com', '8fa12df36fa448606d6f816379d8163d');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('whundayc', 'kroxburchc@cbslocal.com', '1b8fd87849d82671ab8f5a5f3024b380');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('hlouchd', 'eburhilld@mit.edu', 'a66c55944623326d4ace6ca018580971');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('hsoltane', 'fmayhoue@livejournal.com', '7a39af98b0ae3b782847681617a3d804');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('cgildeaf', 'zizhakf@goo.gl', 'f815f8a3131ff00708d18eb6cacead6d');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('achaggg', 'jclearyg@disqus.com', '614d75b5633e0b6401f5ea56ce2310a0');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('jcatchersideh', 'dmarchingtonh@nba.com', '02d984183dfb179452e3b577f8d1ff6f');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('rhullocki', 'khawksbyi@oracle.com', '30a4a31159610e242a14529e521a5010');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('wgianoloj', 'emcgarrityj@wisc.edu', '69bbc1f421e3f9b775961384e94aea27');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('kmcmeekank', 'ldinesk@dailymail.co.uk', '36cca31831f67445eced9ab9baf708e7');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('psherrardl', 'pedmondsonl@istockphoto.com', '2625420f2243ebd15c32ad72d917c71e');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('jpedgriftm', 'gpetyaninm@parallels.com', '4d9eb7d40d7b8685e165c60eaab94b09');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('treinischn', 'vtotaron@theguardian.com', 'e671a8b673cf4d90609bdd7cffcfc522');
INSERT INTO app_user (user_name, email, password_hash) VALUES ('paikino', 'mtraynoro@whitehouse.gov', '187b33807359b1d278dd5217b31834f3');

