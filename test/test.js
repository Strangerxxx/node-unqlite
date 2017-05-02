import unqlite from '../unqlite';
import assert from 'assert';
import temp from 'temp';
import path from 'path';
import {describe, beforeEach, it,} from "mocha";

const DB = unqlite.Database;

describe('open', () => {

    let dbFile;

    beforeEach(function(cb) {
        temp.mkdir(null, function(err, tempPath) {
            if (err) {
                cb(err);
            }
            dbFile = path.join(tempPath, 'test_open.db');
            cb();
        });
    });

    it('default', done => {
        let uql = new DB(dbFile);
        uql.open(err =>{
            assert.equal(err, null);
            done();
        });
    });

    describe('mode', () => {
        it('with READONLY', done =>{
            let uql = new DB(dbFile);
            uql.open(unqlite.OPEN_READONLY, () =>{
                assert.equal(uql.mode, unqlite.OPEN_READONLY);
                done();
            });
        });

        it('with READWRITE', done =>{
            let uql = new DB(dbFile);
            uql.open(unqlite.OPEN_READWRITE, () => {
                assert.equal(uql.mode, unqlite.OPEN_READWRITE);
                done();
            });
        });

        it('with MMAP', done =>{
            let uql = new DB(dbFile);
            uql.open(unqlite.OPEN_MMAP, () => {
                assert.equal(uql.mode, unqlite.OPEN_MMAP);
                done();
            });
        });

        it('with IN_MEMORY', done =>{
            let uql = new DB(dbFile);
            uql.open(unqlite.OPEN_IN_MEMORY, () => {
                assert.equal(uql.mode, unqlite.OPEN_IN_MEMORY);
                done();
            });
        });
    });

    it('close', done =>{
        let uql = new DB(dbFile);
        uql.open(() => {
            uql.close(function(err) {
                assert.equal(err, null);
                done();
            });
        });
    });
});

describe('Key/Value API', () => {
    it('store API', done => {
        let uql = new DB('test/test.db');
        uql.open(unqlite.OPEN_IN_MEMORY, () => {
            uql.store('foo', 'bar', function(err, key, value) {
                assert.equal(key, 'foo');
                assert.equal(value, 'bar');
                done();
            });
        });
    });

    it('fetch API', done =>{
        let uql = new DB('test/test.db');
        uql.open(unqlite.OPEN_IN_MEMORY, () => {
            uql.store('foo', 'bar', function(err, key, value) {
                uql.fetch(key, function(err, key, value) {
                    assert.equal(value, 'bar');
                    done();
                });
            });
        });
    });

    it('append API', done => {
        let uql = new DB('test/test.db');
        uql.open(unqlite.OPEN_IN_MEMORY, () => {
            uql.store('foo', 'bar', () => {
                uql.append('foo', 'baz', function(err, key, value) {
                    uql.fetch(key, function(err, key, value) {
                        assert.equal(value, 'barbaz');
                        done();
                    });
                });
            });
        });
    });

    it('delete API', done => {
        let uql = new DB('test/test.db');
        uql.open(unqlite.OPEN_IN_MEMORY, () => {
            uql.store('foo', 'bar', function(err, key, value) {
                uql.
                delete ('foo',
                    function(err, key) {
                        uql.fetch(key, function(err, key, value) {
                            assert.notEqual(err, null);
                            assert.ok(err.message.match(/^Failed to fetch/));
                            done();
                        });
                    });
            });
        });
    });
});

describe('exceptions', () => {
    describe('new', () => {
        it('argument missing', done => {
            try {
                let uql = new DB();
                assert.fail();
            } catch(e) {
                assert.ok( e instanceof RangeError);
                assert.ok(e.message.match(/A least 1 arguments are required/));
                done();
            }
        });
        it('argument is not string', done => {
            try {
                let uql = new DB(1);
                assert.fail();
            } catch(e) {
                assert.ok( e instanceof TypeError);
                assert.ok(e.message.match(/Argument 1 must be a String/));
                done();
            }
        });
    });
    describe('open', () => {
        it('callback missing', done => {
            try {
                let uql = new DB('');
                uql.open();
                assert.fail('Must be fail');
            } catch(e) {
                assert.ok( e instanceof RangeError);
                assert.ok(e.message.match(/A least 1 arguments are required/));
                done();
            };
        });

        it('callback is not function', done => {
            try {
                let uql = new DB('');
                uql.open(0, 0);
                assert.fail('Must be fail');
            } catch(e) {
                assert.ok( e instanceof TypeError);
                assert.ok(e.message.match(/Argument 2 must be a Function/));
                done();
            }
        });

    });
});
