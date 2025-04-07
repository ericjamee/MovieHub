export interface Movie {
  showId: string;
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  releaseYear: number;
  rating: string;
  duration: number;
  description: string;
  imageUrl: string;
  genre: string;
  Action: number;
  Adventure: number;
  AnimeSeriesInternationalTVShows: number;
  BritishTVShowsDocuseriesInternationalTVShows: number;
  Children: number;
  Comedies: number;
  ComediesDramasInternationalMovies: number;
  ComediesInternationalMovies: number;
  ComediesRomanticMovies: number;
  CrimeTVShowsDocuseries: number;
  Documentaries: number;
  DocumentariesInternationalMovies: number;
  Docuseries: number;
  Dramas: number;
  DramasInternationalMovies: number;
  DramasRomanticMovies: number;
  FamilyMovies: number;
  Fantasy: number;
  HorrorMovies: number;
  InternationalMoviesThrillers: number;
  InternationalTVShowsRomanticTVShowsTVDramas: number;
  KidsTV: number;
  LanguageTVShows: number;
  Musicals: number;
  NatureTV: number;
  RealityTV: number;
  Spirituality: number;
  TVAction: number;
  TVComedies: number;
  TVDramas: number;
  TalkShowsTVComedies: number;
  Thrillers: number;
}

export interface MovieFilters {
  genre?: string;
  searchTerm?: string;
  page: number;
  pageSize: number;
}

export interface MovieResponse {
  movies: Movie[];
  totalNumMovies: number;
}
