--
-- PostgreSQL database dump
--

\restrict HLQVci9tKveQIstYlidGSflgbDkg4xKFzWewxCAyv7gcSFr7SVbUoLGGGfAcWkl

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: inder
--

CREATE TABLE public.comments (
    commentid integer NOT NULL,
    parent_commentid integer,
    userid integer NOT NULL,
    postid integer NOT NULL,
    comment character varying(500) NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO inder;

--
-- Name: comments_commentid_seq; Type: SEQUENCE; Schema: public; Owner: inder
--

ALTER TABLE public.comments ALTER COLUMN commentid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_commentid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: inder
--

CREATE TABLE public.post_likes (
    userid integer NOT NULL,
    postid integer NOT NULL,
    time_liked timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.post_likes OWNER TO inder;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: inder
--

CREATE TABLE public.posts (
    postid integer NOT NULL,
    userid integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.posts OWNER TO inder;

--
-- Name: posts_postid_seq; Type: SEQUENCE; Schema: public; Owner: inder
--

ALTER TABLE public.posts ALTER COLUMN postid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posts_postid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: inder
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) with time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO inder;

--
-- Name: users; Type: TABLE; Schema: public; Owner: inder
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    email public.citext NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    isadmin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO inder;

--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: inder
--

ALTER TABLE public.users ALTER COLUMN userid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (commentid);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (userid, postid);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (postid);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: IDX_sessions_expire; Type: INDEX; Schema: public; Owner: inder
--

CREATE INDEX "IDX_sessions_expire" ON public.sessions USING btree (expire);


--
-- Name: comments comments_parent_commentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_commentid_fkey FOREIGN KEY (parent_commentid) REFERENCES public.comments(commentid);


--
-- Name: comments comments_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_postid_fkey FOREIGN KEY (postid) REFERENCES public.posts(postid) ON DELETE CASCADE;


--
-- Name: comments comments_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_postid_fkey FOREIGN KEY (postid) REFERENCES public.posts(postid);


--
-- Name: post_likes post_likes_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: posts posts_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: inder
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

\unrestrict HLQVci9tKveQIstYlidGSflgbDkg4xKFzWewxCAyv7gcSFr7SVbUoLGGGfAcWkl

